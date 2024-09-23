import HttpException from "./HttpException";
import { ErrorCode, StatusCode } from "../enum/enum";
import { ErrorMessage } from "../shared";

export default class RecordNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
      message || (ErrorMessage[ErrorCode.RESOURCE_NOT_FOUND] as string),
      true,
    );
  }
}
