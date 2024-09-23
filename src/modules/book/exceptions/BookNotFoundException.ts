import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";

export default class BookNotFoundException extends RecordNotFoundException {
  constructor(message?: string) {
    super(message || "book not found!");
  }
}
