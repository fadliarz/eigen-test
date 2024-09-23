import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IBookController } from "../book.interface";
import { BookDITypes } from "../book.type";

export default function BookRouter() {
  const router = express.Router();

  const controller = dIContainer.get<IBookController>(BookDITypes.CONTROLLER);

  router.get("/books", controller.getBooks.bind(controller));

  return router;
}
