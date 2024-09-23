import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ILoanController } from "../loan.interface";
import { LoanDITypes } from "../loan.type";

export default function LoanRouter() {
  const router = express.Router();

  const controller = dIContainer.get<ILoanController>(LoanDITypes.CONTROLLER);

  router.post(
    "/members/:memberCode/loan-book",
    controller.createLoan.bind(controller),
  );

  router.post(
    "/members/:memberCode/return-book",
    controller.returnLoan.bind(controller),
  );

  return router;
}
