import { inject, injectable } from "inversify";
import { ILoanService } from "../loan.interface";
import { GlobalDITypes, IRepository } from "../../../common/shared";
import { LoanModel } from "../loan.type";
import MemberNotFoundException from "../../member/exceptions/MemberNotFoundException";
import MemberIsPenalizedException from "../exceptions/MemberIsPenalizedException";
import MemberLoanLimitException from "../exceptions/MemberLoanLimitException";
import BookNotFoundException from "../../book/exceptions/BookNotFoundException";
import BookOutOFStockException from "../exceptions/BookOutOFStockException";
import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";
import LoanNotFoundException from "../exceptions/LoanNotFoundException";
import runInTransaction from "../../../common/function/runInTransaction";

@injectable()
export default class LoanService implements ILoanService {
  @inject(GlobalDITypes.REPOSITORY)
  private readonly repository: IRepository;

  public async createLoan(
    id: { params: { memberCode: string } },
    dto: {
      bookCode: string;
    },
  ): Promise<LoanModel> {
    return await runInTransaction<LoanModel>(async () => {
      let loan: LoanModel;
      const MAX_RETRIES = 3;
      let retries = 0;
      while (retries < MAX_RETRIES) {
        const member = await this.repository.member.getMemberByCode(
          id.params.memberCode,
        );
        if (!member) throw new MemberNotFoundException();

        if (member.loanCount >= 2) throw new MemberLoanLimitException();

        if (member.penaltyUntil?.getTime()! > new Date().getTime())
          throw new MemberIsPenalizedException();

        const book = await this.repository.book.getBookByCode(dto.bookCode);
        if (!book) throw new BookNotFoundException();

        if (book.stock !== 1) throw new BookOutOFStockException();

        loan = await this.repository.loan.createLoan({
          memberCode: id.params.memberCode,
          bookCode: book.code,
        });

        try {
          await this.repository.member.updateMember(
            member.code,
            {
              version: member.version + 1,
              loanCount: member.loanCount + 1,
            },
            { version: member.version },
          );

          await this.repository.book.updateBook(
            book.code,
            {
              version: book.version + 1,
              stock: book.stock - 1,
            },
            { version: book.version },
          );
        } catch (error) {
          if (error instanceof RecordNotFoundException) {
            retries++;
            continue;
          }

          throw error;
        }

        break;
      }

      return loan!;
    });
  }

  public async returnLoan(
    id: { params: { memberCode: string } },
    dto: {
      bookCode: string;
    },
  ): Promise<{}> {
    return await runInTransaction<{}>(async () => {
      const MAX_RETRIES = 3;
      let retries = 0;
      while (retries < MAX_RETRIES) {
        const member = await this.repository.member.getMemberByCode(
          id.params.memberCode,
        );
        if (!member) throw new MemberNotFoundException();

        const book = await this.repository.book.getBookByCode(dto.bookCode);

        if (!book) {
          throw new BookNotFoundException();
        }

        const loan = await this.repository.loan.getLoanByMemberAndBookCode(
          {
            memberCode: id.params.memberCode,
            bookCode: dto.bookCode,
          },
          { isActive: true },
        );

        if (!loan) {
          throw new LoanNotFoundException();
        }

        let penaltyUntil: Date | null = null;
        if (
          Math.ceil(
            (new Date().getTime() - loan.createdAt.getTime()) /
              (1000 * 3600 * 24),
          ) > 7
        ) {
          const penaltyUntil = new Date();
          penaltyUntil.setDate(penaltyUntil.getDate() + 3);
        }

        try {
          await this.repository.member.updateMember(
            member.code,
            {
              version: member.version + 1,
              loanCount: member.loanCount - 1,
              ...(!!penaltyUntil ? { penaltyUntil } : {}),
            },
            { version: member.version },
          );

          await this.repository.loan.updateLoan(loan.id, { isActive: false });

          await this.repository.book.updateBook(
            book.code,
            {
              version: book.version + 1,
              stock: book.stock + 1,
            },
            { version: book.version },
          );
        } catch (error) {
          if (error instanceof RecordNotFoundException) {
            retries++;
            continue;
          }

          throw error;
        }

        break;
      }

      return {};
    });
  }
}
