import {inject, injectable} from "inversify";
import {IRepository} from "../shared";
import {IMemberRepository} from "../../modules/member/member.interface";
import {MemberDITypes} from "../../modules/member/member.type";
import {IBookRepository} from "../../modules/book/book.interface";
import {BookDITypes} from "../../modules/book/book.type";
import {ILoanRepository} from "../../modules/loan/loan.interface";
import {LoanDITypes} from "../../modules/loan/loan.type";

@injectable()
export default class Repository implements IRepository {
    @inject(MemberDITypes.REPOSITORY)
    public readonly member: IMemberRepository

    @inject(BookDITypes.REPOSITORY)
    public readonly book: IBookRepository

    @inject(LoanDITypes.REPOSITORY)
    public readonly loan: ILoanRepository
}