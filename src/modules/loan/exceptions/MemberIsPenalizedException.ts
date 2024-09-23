import BadRequestException from "../../../common/exceptions/BadRequestException";

export default class MemberIsPenalizedException extends BadRequestException {
  constructor(message?: string) {
    super(message || "member is penalized!");
  }
}
