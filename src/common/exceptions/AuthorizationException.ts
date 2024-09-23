import HttpException from "./HttpException";
import { ErrorCode, StatusCode } from "../enum/enum";

export default class AuthorizationException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED,
      "unauthorized!",
      true,
    );
  }
}
