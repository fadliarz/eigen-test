import { Prisma } from "@prisma/client";
import { DatabaseOperationConstraint, PrismaErrorCode } from "../shared";
import HttpException from "../exceptions/HttpException";
import { ErrorCode, StatusCode } from "../enum/enum";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import InternalServerException from "../exceptions/InternalServerException";

export default function handlePrismaRepositoryError(
  error: Error,
  constraint?: DatabaseOperationConstraint<string>,
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
      const defaultError = new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.FOREIGN_KEY_CONSTRAINT,
        error.message,
      );

      if (!constraint || !constraint.foreignConstraint) {
        return defaultError;
      }

      const field = error.message.split("field: ")[1];
      const { foreignConstraint } = constraint;

      if (foreignConstraint.hasOwnProperty(field)) {
        return foreignConstraint[field];
      }

      return foreignConstraint.default || defaultError;
    }

    if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
      const defaultError = new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.UNIQUE_CONSTRAINT,
        error.message,
      );

      if (!constraint || !constraint.uniqueConstraint) {
        return defaultError;
      }

      const field = (error.meta?.target as Array<string>).join("&");
      const { uniqueConstraint } = constraint;

      if (uniqueConstraint.hasOwnProperty(field)) {
        return uniqueConstraint[field];
      }

      return uniqueConstraint.default || defaultError;
    }

    if (error.code === PrismaErrorCode.RECORD_NOT_FOUND) {
      return constraint?.recordNotFound?.default
        ? constraint.recordNotFound.default
        : new RecordNotFoundException();
    }
  }

  return error instanceof HttpException ? error : new InternalServerException();
}
