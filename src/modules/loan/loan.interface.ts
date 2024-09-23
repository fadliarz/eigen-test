import { LoanModel } from "./loan.type";
import { NextFunction, Request, Response } from "express";

export interface ILoanController {
  createLoan: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  returnLoan: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ILoanService {
  createLoan: (
    id: { params: { memberCode: string } },
    dto: {
      bookCode: string;
    },
  ) => Promise<LoanModel>;
  returnLoan: (
    id: { params: { memberCode: string } },
    dto: {
      bookCode: string;
    },
  ) => Promise<{}>;
}

export interface ILoanRepository {
  createLoan: (data: {
    memberCode: string;
    bookCode: string;
  }) => Promise<LoanModel>;
  updateLoan: (
    id: number,
    data: Partial<LoanModel>,
    where?: { version: number },
  ) => Promise<LoanModel>;
  getLoanById: (id: number) => Promise<LoanModel | null>;
  getLoanByMemberAndBookCode: (
    code: {
      memberCode: string;
      bookCode: string;
    },
    where?: { isActive?: boolean },
  ) => Promise<LoanModel | null>;
}
