"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const shared_1 = require("../../../common/shared");
const MemberNotFoundException_1 = __importDefault(require("../../member/exceptions/MemberNotFoundException"));
const MemberIsPenalizedException_1 = __importDefault(require("../exceptions/MemberIsPenalizedException"));
const MemberLoanLimitException_1 = __importDefault(require("../exceptions/MemberLoanLimitException"));
const BookNotFoundException_1 = __importDefault(require("../../book/exceptions/BookNotFoundException"));
const BookOutOFStockException_1 = __importDefault(require("../exceptions/BookOutOFStockException"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/exceptions/RecordNotFoundException"));
const LoanNotFoundException_1 = __importDefault(require("../exceptions/LoanNotFoundException"));
const runInTransaction_1 = __importDefault(require("../../../common/function/runInTransaction"));
let LoanService = class LoanService {
    createLoan(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, runInTransaction_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let loan;
                const MAX_RETRIES = 3;
                let retries = 0;
                while (retries < MAX_RETRIES) {
                    const member = yield this.repository.member.getMemberByCode(id.params.memberCode);
                    if (!member)
                        throw new MemberNotFoundException_1.default();
                    if (member.loanCount >= 2)
                        throw new MemberLoanLimitException_1.default();
                    if (((_a = member.penaltyUntil) === null || _a === void 0 ? void 0 : _a.getTime()) > new Date().getTime())
                        throw new MemberIsPenalizedException_1.default();
                    const book = yield this.repository.book.getBookByCode(dto.bookCode);
                    if (!book)
                        throw new BookNotFoundException_1.default();
                    if (book.stock !== 1)
                        throw new BookOutOFStockException_1.default();
                    loan = yield this.repository.loan.createLoan({
                        memberCode: id.params.memberCode,
                        bookCode: book.code,
                    });
                    try {
                        yield this.repository.member.updateMember(member.code, {
                            version: member.version + 1,
                            loanCount: member.loanCount + 1,
                        }, { version: member.version });
                        yield this.repository.book.updateBook(book.code, {
                            version: book.version + 1,
                            stock: book.stock - 1,
                        }, { version: book.version });
                    }
                    catch (error) {
                        if (error instanceof RecordNotFoundException_1.default) {
                            retries++;
                            continue;
                        }
                        throw error;
                    }
                    break;
                }
                return loan;
            }));
        });
    }
    returnLoan(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, runInTransaction_1.default)(() => __awaiter(this, void 0, void 0, function* () {
                const MAX_RETRIES = 3;
                let retries = 0;
                while (retries < MAX_RETRIES) {
                    const member = yield this.repository.member.getMemberByCode(id.params.memberCode);
                    if (!member)
                        throw new MemberNotFoundException_1.default();
                    const book = yield this.repository.book.getBookByCode(dto.bookCode);
                    if (!book) {
                        throw new BookNotFoundException_1.default();
                    }
                    const loan = yield this.repository.loan.getLoanByMemberAndBookCode({
                        memberCode: id.params.memberCode,
                        bookCode: dto.bookCode,
                    }, { isActive: true });
                    if (!loan) {
                        throw new LoanNotFoundException_1.default();
                    }
                    let penaltyUntil = null;
                    if (Math.ceil((new Date().getTime() - loan.createdAt.getTime()) /
                        (1000 * 3600 * 24)) > 7) {
                        const penaltyUntil = new Date();
                        penaltyUntil.setDate(penaltyUntil.getDate() + 3);
                    }
                    try {
                        yield this.repository.member.updateMember(member.code, Object.assign({ version: member.version + 1, loanCount: member.loanCount - 1 }, (!!penaltyUntil ? { penaltyUntil } : {})), { version: member.version });
                        yield this.repository.loan.updateLoan(loan.id, { isActive: false });
                        yield this.repository.book.updateBook(book.code, {
                            version: book.version + 1,
                            stock: book.stock + 1,
                        }, { version: book.version });
                    }
                    catch (error) {
                        if (error instanceof RecordNotFoundException_1.default) {
                            retries++;
                            continue;
                        }
                        throw error;
                    }
                    break;
                }
                return {};
            }));
        });
    }
};
__decorate([
    (0, inversify_1.inject)(shared_1.GlobalDITypes.REPOSITORY),
    __metadata("design:type", Object)
], LoanService.prototype, "repository", void 0);
LoanService = __decorate([
    (0, inversify_1.injectable)()
], LoanService);
exports.default = LoanService;
