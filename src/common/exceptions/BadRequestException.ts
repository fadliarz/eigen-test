import HttpException from "./HttpException";
import { ErrorCode, StatusCode } from "../enum/enum";

export default class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.BAD_REQUEST,
      ErrorCode.BAD_REQUEST,
      message || "bad request!",
      true,
    );
  }
}
