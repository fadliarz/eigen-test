import "reflect-metadata";
import { Container } from "inversify";
import {
  IMemberController,
  IMemberRepository,
  IMemberService,
} from "./modules/member/member.interface";
import { MemberDITypes } from "./modules/member/member.type";
import MemberRepository from "./modules/member/repository/member.repository";
import MemberController from "./modules/member/controller/member.controller";
import MemberService from "./modules/member/service/member.service";
import {
  IBookController,
  IBookRepository,
  IBookService,
} from "./modules/book/book.interface";
import { BookDITypes } from "./modules/book/book.type";
import BookController from "./modules/book/controller/book.controller";
import BookService from "./modules/book/service/book.service";
import BookRepository from "./modules/book/repository/book.repository";
import {
  ILoanController,
  ILoanRepository,
  ILoanService,
} from "./modules/loan/loan.interface";
import { LoanDITypes } from "./modules/loan/loan.type";
import LoanService from "./modules/loan/service/loan.service";
import LoanController from "./modules/loan/controller/loan.controller";
import LoanRepository from "./modules/loan/repository/loan.repository";
import { GlobalDITypes, IRepository } from "./common/shared";
import Repository from "./common/class/Repository";

const dIContainer = new Container();

dIContainer.bind<IRepository>(GlobalDITypes.REPOSITORY).to(Repository);

dIContainer
  .bind<IMemberController>(MemberDITypes.CONTROLLER)
  .to(MemberController);
dIContainer.bind<IMemberService>(MemberDITypes.SERVICE).to(MemberService);
dIContainer
  .bind<IMemberRepository>(MemberDITypes.REPOSITORY)
  .to(MemberRepository);

dIContainer.bind<IBookController>(BookDITypes.CONTROLLER).to(BookController);
dIContainer.bind<IBookService>(BookDITypes.SERVICE).to(BookService);
dIContainer.bind<IBookRepository>(BookDITypes.REPOSITORY).to(BookRepository);

dIContainer.bind<ILoanController>(LoanDITypes.CONTROLLER).to(LoanController);
dIContainer.bind<ILoanService>(LoanDITypes.SERVICE).to(LoanService);
dIContainer.bind<ILoanRepository>(LoanDITypes.REPOSITORY).to(LoanRepository);

export default dIContainer;
