import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import { IBookRepository } from "../book.interface";
import { BookModel } from "../book.type";
import handlePrismaRepositoryError from "../../../common/function/handlePrismaRepositoryError";

@injectable()
export default class BookRepository
  extends BaseRepository
  implements IBookRepository
{
  constructor() {
    super();
  }

  public async getBooks(where?: { stock: number }): Promise<BookModel[]> {
    try {
      return await this.db.book.findMany({
        where: {
          ...(where?.stock ? { stock: where.stock } : {}),
        },
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async getBookByCode(code: string): Promise<BookModel | null> {
    try {
      return await this.db.book.findUnique({ where: { code: code } });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async updateBook(
    code: string,
    data: Partial<BookModel>,
    where:
      | {
          version?: number;
        }
      | undefined,
  ): Promise<BookModel> {
    try {
      return await this.db.book.update({
        where: {
          code,
          ...(!!where ? where : {}),
        },
        data,
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }
}
