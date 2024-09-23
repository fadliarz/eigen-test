import { inject, injectable } from "inversify";
import e, { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/enum/enum";
import { IBookController, IBookService } from "../book.interface";
import { BookDITypes } from "../book.type";

@injectable()
export default class BookController implements IBookController {
  @inject(BookDITypes.SERVICE)
  private readonly service: IBookService;

  public async getBooks(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<e.Response | void> {
    try {
      const books = await this.service.getBooks();

      return res.status(StatusCode.SUCCESS).json({ data: books });
    } catch (error) {
      next(error);
    }
  }
}
