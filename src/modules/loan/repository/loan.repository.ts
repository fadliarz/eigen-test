import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import { ILoanRepository } from "../loan.interface";
import { LoanModel } from "../loan.type";
import handlePrismaRepositoryError from "../../../common/function/handlePrismaRepositoryError";

@injectable()
export default class LoanRepository
  extends BaseRepository
  implements ILoanRepository
{
  constructor() {
    super();
  }

  public async createLoan(data: {
    memberCode: string;
    bookCode: string;
  }): Promise<LoanModel> {
    try {
      return await this.db.loan.create({ data });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async getLoanById(id: number): Promise<LoanModel | null> {
    try {
      return await this.db.loan.findUnique({ where: { id } });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async updateLoan(
    id: number,
    data: Partial<LoanModel>,
    where?:
      | {
          version: number;
        }
      | undefined,
  ): Promise<LoanModel> {
    try {
      return await this.db.loan.update({
        where: { id, ...(where?.version ? { version: where.version } : {}) },
        data: { ...data },
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async getLoanByMemberAndBookCode(
    code: {
      memberCode: string;
      bookCode: string;
    },
    where?: { isActive?: boolean },
  ): Promise<LoanModel | null> {
    try {
      return await this.db.loan.findFirst({
        where: {
          ...code,
          ...(!!where?.isActive ? { isActive: where.isActive } : {}),
        },
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }
}
