import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";

export default class LoanNotFoundException extends RecordNotFoundException {
  constructor(message?: string) {
    super(message || "loan not found!");
  }
}
