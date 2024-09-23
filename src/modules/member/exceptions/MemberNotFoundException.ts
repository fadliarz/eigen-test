import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/enum/enum";
import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";

export default class MemberNotFoundException extends RecordNotFoundException {
  constructor(message?: string) {
    super(message || "member not found!");
  }
}
