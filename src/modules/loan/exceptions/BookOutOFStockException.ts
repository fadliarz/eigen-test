import BadRequestException from "../../../common/exceptions/BadRequestException";

export default class BookOutOFStockException extends BadRequestException {
  constructor(message?: string) {
    super(message || "book is out of stock!");
  }
}
