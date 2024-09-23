import { ILoanController, ILoanService } from "../loan.interface";
import { inject, injectable } from "inversify";
import { LoanDITypes } from "../loan.type";
import e from "express";
import { StatusCode } from "../../../common/enum/enum";

@injectable()
export default class LoanController implements ILoanController {
  @inject(LoanDITypes.SERVICE)
  private readonly service: ILoanService;

  public async createLoan(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<e.Response | void> {
    try {
      /// request body validation with Joi

      const createdLoan = await this.service.createLoan(
        { params: { memberCode: req.params.memberCode } },
        { bookCode: String(req.body.bookCode) },
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json({ data: createdLoan });
    } catch (error) {
      next(error);
    }
  }

  public async returnLoan(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<e.Response | void> {
    try {
      // request body validation with Joi

      await this.service.returnLoan(
        { params: { memberCode: req.params.memberCode } },
        { bookCode: String(req.body.bookCode) },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
