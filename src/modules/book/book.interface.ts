import { BookModel } from "./book.type";
import { NextFunction, Request, Response } from "express";

export interface IBookController {
  getBooks: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IBookService {
  getBooks: () => Promise<BookModel[]>;
}

export interface IBookRepository {
  getBooks: (where?: { stock: number }) => Promise<BookModel[]>;
  getBookByCode: (code: string) => Promise<BookModel | null>;
  updateBook: (
    code: string,
    data: Partial<BookModel>,
    where?: { version?: number },
  ) => Promise<BookModel>;
}
