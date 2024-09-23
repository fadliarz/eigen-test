"use strict";
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
const MemberNotFoundException_1 = __importDefault(require("../../member/exceptions/MemberNotFoundException"));
const MemberIsPenalizedException_1 = __importDefault(require("../exceptions/MemberIsPenalizedException"));
const MemberLoanLimitException_1 = __importDefault(require("../exceptions/MemberLoanLimitException"));
const BookNotFoundException_1 = __importDefault(require("../../book/exceptions/BookNotFoundException"));
const BookOutOFStockException_1 = __importDefault(require("../exceptions/BookOutOFStockException"));
const runInTransaction_1 = __importDefault(require("../../../common/function/runInTransaction"));
const loan_type_1 = require("../loan.type");
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const loan_repository_1 = __importDefault(require("../repository/loan.repository"));
const member_type_1 = require("../../member/member.type");
const book_type_1 = require("../../book/book.type");
const member_repository_1 = __importDefault(require("../../member/repository/member.repository"));
const book_repository_1 = __importDefault(require("../../book/repository/book.repository"));
const LoanNotFoundException_1 = __importDefault(require("../exceptions/LoanNotFoundException"));
jest.mock("../../../common/function/runInTransaction");
/**
 * Member
 *
 */
const mockGetMembers = jest.fn();
const mockGetMemberByCode = jest.fn();
const mockUpdateMember = jest.fn();
/**
 * Book
 *
 */
const mockGetBooks = jest.fn();
const mockGetBookByCode = jest.fn();
const mockUpdateBook = jest.fn();
/**
 * Loan
 *
 */
const mockCreateLoan = jest.fn();
const mockUpdateLoan = jest.fn();
const mockGetLoanById = jest.fn();
const mockGetLoanByMemberAndBookCode = jest.fn();
describe("LoanService", () => {
    let sut;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(member_type_1.MemberDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(member_type_1.MemberDITypes.REPOSITORY)
            .toConstantValue({
            getMembers: mockGetMembers,
            getMemberByCode: mockGetMemberByCode,
            updateMember: mockUpdateMember,
        });
        inversifyConfig_1.default.unbind(book_type_1.BookDITypes.REPOSITORY);
        inversifyConfig_1.default.bind(book_type_1.BookDITypes.REPOSITORY).toConstantValue({
            getBooks: mockGetBooks,
            getBookByCode: mockGetBookByCode,
            updateBook: mockUpdateBook,
        });
        inversifyConfig_1.default.unbind(loan_type_1.LoanDITypes.REPOSITORY);
        inversifyConfig_1.default.bind(loan_type_1.LoanDITypes.REPOSITORY).toConstantValue({
            createLoan: mockCreateLoan,
            updateLoan: mockUpdateLoan,
            getLoanById: mockGetLoanById,
            getLoanByMemberAndBookCode: mockGetLoanByMemberAndBookCode,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(member_type_1.MemberDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(member_type_1.MemberDITypes.REPOSITORY)
            .to(member_repository_1.default);
        inversifyConfig_1.default.unbind(book_type_1.BookDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(book_type_1.BookDITypes.REPOSITORY)
            .to(book_repository_1.default);
        inversifyConfig_1.default.unbind(loan_type_1.LoanDITypes.REPOSITORY);
        inversifyConfig_1.default
            .bind(loan_type_1.LoanDITypes.REPOSITORY)
            .to(loan_repository_1.default);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(loan_type_1.LoanDITypes.SERVICE);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createLoan", () => {
        it("should create a loan successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            const book = { code: "book1", stock: 1, version: 1 };
            const loan = { id: 1, memberCode: "member1", bookCode: "book1" };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(book);
            mockCreateLoan.mockResolvedValue(loan);
            runInTransaction_1.default.mockImplementation((fn) => fn());
            const result = yield sut.createLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" });
            expect(result).toEqual(loan);
        }));
        it("should throw MemberNotFoundException if member is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetMemberByCode.mockResolvedValue(null);
            yield expect(sut.createLoan({ params: { memberCode: "nonexistent" } }, { bookCode: "book1" })).rejects.toThrow(MemberNotFoundException_1.default);
        }));
        it("should throw MemberLoanLimitException if member has reached loan limit", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 2,
                version: 1,
                penaltyUntil: null,
            };
            mockGetMemberByCode.mockResolvedValue(member);
            yield expect(sut.createLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" })).rejects.toThrow(MemberLoanLimitException_1.default);
        }));
        it("should throw MemberIsPenalizedException if member is penalized", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 0,
                version: 1,
                penaltyUntil: new Date(Date.now() + 10000),
            };
            mockGetMemberByCode.mockResolvedValue(member);
            yield expect(sut.createLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" })).rejects.toThrow(MemberIsPenalizedException_1.default);
        }));
        it("should throw BookNotFoundException if book is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(null);
            yield expect(sut.createLoan({ params: { memberCode: "member1" } }, { bookCode: "nonexistent" })).rejects.toThrow(BookNotFoundException_1.default);
        }));
        it("should throw BookOutOFStockException if book is out of stock", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            const book = { code: "book1", stock: 0, version: 1 };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(book);
            yield expect(sut.createLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" })).rejects.toThrow(BookOutOFStockException_1.default);
        }));
    });
    describe("returnLoan", () => {
        it("should return a loan successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            const book = { code: "book1", stock: 0, version: 1 };
            const loan = { id: 1, createdAt: new Date(), isActive: true };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(book);
            mockGetLoanByMemberAndBookCode.mockResolvedValue(loan);
            const result = yield sut.returnLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" });
            expect(result).toEqual({});
        }));
        it("should throw if the member does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            mockGetMemberByCode.mockResolvedValue(null);
            yield expect(sut.returnLoan({ params: { memberCode: "nonexistent" } }, { bookCode: "book1" })).rejects.toThrow(MemberNotFoundException_1.default);
        }));
        it("should throw if the book does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(null);
            yield expect(sut.returnLoan({ params: { memberCode: "member1" } }, { bookCode: "nonexistent" })).rejects.toThrow(BookNotFoundException_1.default);
        }));
        it("should throw LoanNotFoundException if active loan is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const member = {
                code: "member1",
                loanCount: 1,
                version: 1,
                penaltyUntil: null,
            };
            const book = { code: "book1", stock: 0, version: 1 };
            mockGetMemberByCode.mockResolvedValue(member);
            mockGetBookByCode.mockResolvedValue(book);
            mockGetLoanByMemberAndBookCode.mockResolvedValue(null);
            yield expect(sut.returnLoan({ params: { memberCode: "member1" } }, { bookCode: "book1" })).rejects.toThrow(LoanNotFoundException_1.default);
        }));
    });
});
