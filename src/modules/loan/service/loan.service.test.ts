import MemberNotFoundException from "../../member/exceptions/MemberNotFoundException";
import MemberIsPenalizedException from "../exceptions/MemberIsPenalizedException";
import MemberLoanLimitException from "../exceptions/MemberLoanLimitException";
import BookNotFoundException from "../../book/exceptions/BookNotFoundException";
import BookOutOFStockException from "../exceptions/BookOutOFStockException";
import runInTransaction from "../../../common/function/runInTransaction";
import { ILoanRepository, ILoanService } from "../loan.interface";
import { LoanDITypes } from "../loan.type";
import dIContainer from "../../../inversifyConfig";
import LoanRepository from "../repository/loan.repository";
import { MemberDITypes } from "../../member/member.type";
import { IMemberRepository } from "../../member/member.interface";
import { BookDITypes } from "../../book/book.type";
import { IBookRepository } from "../../book/book.interface";
import MemberRepository from "../../member/repository/member.repository";
import BookRepository from "../../book/repository/book.repository";
import LoanNotFoundException from "../exceptions/LoanNotFoundException";

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
  let sut: ILoanService;

  beforeAll(() => {
    dIContainer.unbind(MemberDITypes.REPOSITORY);
    dIContainer
      .bind<IMemberRepository>(MemberDITypes.REPOSITORY)
      .toConstantValue({
        getMembers: mockGetMembers,
        getMemberByCode: mockGetMemberByCode,
        updateMember: mockUpdateMember,
      });

    dIContainer.unbind(BookDITypes.REPOSITORY);
    dIContainer.bind<IBookRepository>(BookDITypes.REPOSITORY).toConstantValue({
      getBooks: mockGetBooks,
      getBookByCode: mockGetBookByCode,
      updateBook: mockUpdateBook,
    });

    dIContainer.unbind(LoanDITypes.REPOSITORY);
    dIContainer.bind<ILoanRepository>(LoanDITypes.REPOSITORY).toConstantValue({
      createLoan: mockCreateLoan,
      updateLoan: mockUpdateLoan,
      getLoanById: mockGetLoanById,
      getLoanByMemberAndBookCode: mockGetLoanByMemberAndBookCode,
    });
  });

  afterAll(() => {
    dIContainer.unbind(MemberDITypes.REPOSITORY);
    dIContainer
      .bind<IMemberRepository>(MemberDITypes.REPOSITORY)
      .to(MemberRepository);

    dIContainer.unbind(BookDITypes.REPOSITORY);
    dIContainer
      .bind<IBookRepository>(BookDITypes.REPOSITORY)
      .to(BookRepository);

    dIContainer.unbind(LoanDITypes.REPOSITORY);
    dIContainer
      .bind<ILoanRepository>(LoanDITypes.REPOSITORY)
      .to(LoanRepository);
  });

  beforeEach(() => {
    sut = dIContainer.get<ILoanService>(LoanDITypes.SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLoan", () => {
    it("should create a loan successfully", async () => {
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
      (runInTransaction as any).mockImplementation((fn: () => {}) => fn());

      const result = await sut.createLoan(
        { params: { memberCode: "member1" } },
        { bookCode: "book1" },
      );

      expect(result).toEqual(loan);
    });

    it("should throw MemberNotFoundException if member is not found", async () => {
      mockGetMemberByCode.mockResolvedValue(null);

      await expect(
        sut.createLoan(
          { params: { memberCode: "nonexistent" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(MemberNotFoundException);
    });

    it("should throw MemberLoanLimitException if member has reached loan limit", async () => {
      const member = {
        code: "member1",
        loanCount: 2,
        version: 1,
        penaltyUntil: null,
      };
      mockGetMemberByCode.mockResolvedValue(member);

      await expect(
        sut.createLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(MemberLoanLimitException);
    });

    it("should throw MemberIsPenalizedException if member is penalized", async () => {
      const member = {
        code: "member1",
        loanCount: 0,
        version: 1,
        penaltyUntil: new Date(Date.now() + 10000),
      };
      mockGetMemberByCode.mockResolvedValue(member);

      await expect(
        sut.createLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(MemberIsPenalizedException);
    });

    it("should throw BookNotFoundException if book is not found", async () => {
      const member = {
        code: "member1",
        loanCount: 1,
        version: 1,
        penaltyUntil: null,
      };
      mockGetMemberByCode.mockResolvedValue(member);
      mockGetBookByCode.mockResolvedValue(null);

      await expect(
        sut.createLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "nonexistent" },
        ),
      ).rejects.toThrow(BookNotFoundException);
    });

    it("should throw BookOutOFStockException if book is out of stock", async () => {
      const member = {
        code: "member1",
        loanCount: 1,
        version: 1,
        penaltyUntil: null,
      };
      const book = { code: "book1", stock: 0, version: 1 };
      mockGetMemberByCode.mockResolvedValue(member);
      mockGetBookByCode.mockResolvedValue(book);

      await expect(
        sut.createLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(BookOutOFStockException);
    });
  });

  describe("returnLoan", () => {
    it("should return a loan successfully", async () => {
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

      const result = await sut.returnLoan(
        { params: { memberCode: "member1" } },
        { bookCode: "book1" },
      );

      expect(result).toEqual({});
    });

    it("should throw if the member does not exist", async () => {
      mockGetMemberByCode.mockResolvedValue(null);

      await expect(
        sut.returnLoan(
          { params: { memberCode: "nonexistent" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(MemberNotFoundException);
    });

    it("should throw if the book does not exist", async () => {
      const member = {
        code: "member1",
        loanCount: 1,
        version: 1,
        penaltyUntil: null,
      };
      mockGetMemberByCode.mockResolvedValue(member);
      mockGetBookByCode.mockResolvedValue(null);

      await expect(
        sut.returnLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "nonexistent" },
        ),
      ).rejects.toThrow(BookNotFoundException);
    });

    it("should throw LoanNotFoundException if active loan is not found", async () => {
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

      await expect(
        sut.returnLoan(
          { params: { memberCode: "member1" } },
          { bookCode: "book1" },
        ),
      ).rejects.toThrow(LoanNotFoundException);
    });
  });
});
