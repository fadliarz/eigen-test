import BadRequestException from "../../../common/exceptions/BadRequestException";

export default class MemberLoanLimitException extends BadRequestException {
  constructor(message?: string) {
    super(message || "maximum number of loan is 2!");
  }
}
