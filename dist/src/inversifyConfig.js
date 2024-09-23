"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const member_type_1 = require("./modules/member/member.type");
const member_repository_1 = __importDefault(require("./modules/member/repository/member.repository"));
const member_controller_1 = __importDefault(require("./modules/member/controller/member.controller"));
const member_service_1 = __importDefault(require("./modules/member/service/member.service"));
const book_type_1 = require("./modules/book/book.type");
const book_controller_1 = __importDefault(require("./modules/book/controller/book.controller"));
const book_service_1 = __importDefault(require("./modules/book/service/book.service"));
const book_repository_1 = __importDefault(require("./modules/book/repository/book.repository"));
const loan_type_1 = require("./modules/loan/loan.type");
const loan_service_1 = __importDefault(require("./modules/loan/service/loan.service"));
const loan_controller_1 = __importDefault(require("./modules/loan/controller/loan.controller"));
const loan_repository_1 = __importDefault(require("./modules/loan/repository/loan.repository"));
const shared_1 = require("./common/shared");
const Repository_1 = __importDefault(require("./common/class/Repository"));
const dIContainer = new inversify_1.Container();
dIContainer.bind(shared_1.GlobalDITypes.REPOSITORY).to(Repository_1.default);
dIContainer
    .bind(member_type_1.MemberDITypes.CONTROLLER)
    .to(member_controller_1.default);
dIContainer.bind(member_type_1.MemberDITypes.SERVICE).to(member_service_1.default);
dIContainer
    .bind(member_type_1.MemberDITypes.REPOSITORY)
    .to(member_repository_1.default);
dIContainer.bind(book_type_1.BookDITypes.CONTROLLER).to(book_controller_1.default);
dIContainer.bind(book_type_1.BookDITypes.SERVICE).to(book_service_1.default);
dIContainer.bind(book_type_1.BookDITypes.REPOSITORY).to(book_repository_1.default);
dIContainer.bind(loan_type_1.LoanDITypes.CONTROLLER).to(loan_controller_1.default);
dIContainer.bind(loan_type_1.LoanDITypes.SERVICE).to(loan_service_1.default);
dIContainer.bind(loan_type_1.LoanDITypes.REPOSITORY).to(loan_repository_1.default);
exports.default = dIContainer;
