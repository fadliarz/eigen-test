export type BookModel = {
  code: string;
  title: string;
  author: string;
  stock: number;
  version: number;
};

export const BookDITypes = {
  REPOSITORY: Symbol.for("BOOK_REPOSITORY"),
  SERVICE: Symbol.for("BOOK_SERVICE"),
  CONTROLLER: Symbol.for("BOOK_CONTROLLER"),
} as const;
