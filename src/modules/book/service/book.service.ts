import { inject, injectable } from "inversify";
import { IBookRepository, IBookService } from "../book.interface";
import { BookDITypes, BookModel } from "../book.type";

@injectable()
export default class BookService implements IBookService {
  @inject(BookDITypes.REPOSITORY)
  private readonly repository: IBookRepository;

  public async getBooks(): Promise<BookModel[]> {
    return this.repository.getBooks({ stock: 1 });
  }
}
