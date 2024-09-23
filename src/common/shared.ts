import { PrismaClient } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";
import { IMemberRepository } from "../modules/member/member.interface";
import { IBookRepository } from "../modules/book/book.interface";
import { ILoanRepository } from "../modules/loan/loan.interface";
import { Router } from "express";
import { ErrorCode } from "./enum/enum";
import HttpException from "./exceptions/HttpException";

export type Transaction = Omit<PrismaClient, runtime.ITXClientDenyList>;

export type Api = {
  router: Router;
  middleware?: any[];
};

export interface IRepository {
  member: IMemberRepository;
  book: IBookRepository;
  loan: ILoanRepository;
}

export const GlobalDITypes = {
  REPOSITORY: Symbol.for("GLOBAL_REPOSITORY"),
} as const;

type Key = ErrorCode | "NAN_PARAMS";

export const ErrorMessage: Record<Key, string | ((...arg: any) => string)> = {
  [ErrorCode.UNAUTHENTICATED]: "Unauthenticated, please login first!",
  [ErrorCode.UNAUTHORIZED]:
    "Unauthorized, you are not allowed to do this operation!",
  [ErrorCode.FORBIDDEN]: "Forbidden, you are not allowed to do this operation!",
  [ErrorCode.BAD_REQUEST]: "BadRequest, unknown client side error!",
  [ErrorCode.INVALID_QUERY]: "Invalid input query!",
  [ErrorCode.INVALID_PARAMS]: "Invalid input parameter!",
  [ErrorCode.INVALID_BODY]: "Invalid input body!",
  [ErrorCode.FAILED_ON_AUTHENTICATION]: "Authentication failed!",
  [ErrorCode.FOREIGN_KEY_CONSTRAINT]: (field?: string) => {
    return `Foreign key constraint${field ? ` on field ${field}` : "!"}`;
  },
  [ErrorCode.UNIQUE_CONSTRAINT]: (field?: string) => {
    return `Unique constraint${field ? ` on field ${field}` : "!"}`;
  },
  [ErrorCode.NON_EXISTENT_RESOURCE]: "Non-existent resource!",
  [ErrorCode.RESOURCE_NOT_FOUND]: "Resource not found!",
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    "Internal server error, please try again later!",

  /**
   * Additional Key
   */

  NAN_PARAMS: (params: string) => {
    return `Invalid URL params on ${params} (one or more parameter is not a number)!`;
  },
};

export type DatabaseOperationConstraint<Field extends string> = {
  uniqueConstraint?: Record<Field, HttpException> & {
    default?: HttpException;
  };
  foreignConstraint?: Record<Field, HttpException> & {
    default?: HttpException;
  };
  recordNotFound?: { default?: HttpException };
};

export const PrismaErrorCode = {
  UNIQUE_CONSTRAINT: "P2002",
  FOREIGN_KEY_CONSTRAINT: "P2003",
  RECORD_NOT_FOUND: "P2025",
};
