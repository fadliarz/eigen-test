import HttpException from "./HttpException";
import { ErrorCode, StatusCode } from "../enum/enum";
import { ErrorMessage } from "../shared";

export default class InternalServerException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
      message || (ErrorMessage[ErrorCode.INTERNAL_SERVER_ERROR] as string),
      true,
    );
  }
}
