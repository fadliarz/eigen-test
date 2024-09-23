import "reflect-metadata";
import dIContainer from "../../inversifyConfig";
import { ILoanService } from "./loan.interface";
import { LoanDITypes } from "./loan.type";
import PrismaClientSingleton from "../../common/class/PrismaClientSingleton";
import { Prisma, PrismaClient } from "@prisma/client";
import BookOutOFStockException from "./exceptions/BookOutOFStockException";
import MemberLoanLimitException from "./exceptions/MemberLoanLimitException";
import LoanNotFoundException from "./exceptions/LoanNotFoundException";

let service: ILoanService;
let prisma: PrismaClient;

function generateIncrementingArray(size: number): number[] {
  return Array.from({ length: size }, (_, index) => index);
}

beforeEach(async () => {
  prisma = PrismaClientSingleton.getInstance();
  service = dIContainer.get<ILoanService>(LoanDITypes.SERVICE);

  const tableNames = Object.values(Prisma.ModelName);

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
    );
  }
});

describe("LoanService - Concurrent Loan Creation", () => {
  it("CASE 1: ONE MEMBER LOANS THE SAME BOOK CONCURRENTLY", async () => {
    const member = await prisma.member.create({
      data: { code: "TEST-MEMBER-01", name: "TEST" },
    });
    const book = await prisma.book.create({
      data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR" },
    });

    const createLoanRequest = () =>
      service.createLoan(
        { params: { memberCode: member.code } },
        { bookCode: book.code },
      );

    const results = await Promise.allSettled([
      createLoanRequest(),
      createLoanRequest(),
      createLoanRequest(),
      createLoanRequest(),
      createLoanRequest(),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(4);

    rejected.forEach((error) => {
      expect(error.reason).toBeInstanceOf(BookOutOFStockException);
    });
  });

  it("CASE 2: ONE MEMBER LOANS MULTIPLE BOOKS CONCURRENTLY", async () => {
    const prisma = PrismaClientSingleton.getInstance();

    const member = await prisma.member.create({
      data: { code: "TEST-MEMBER-01", name: "TEST" },
    });

    const numArray = generateIncrementingArray(15);
    for (const i of numArray) {
      await prisma.book.create({
        data: { code: `TEST-BOOK-${i}`, title: "TITLE", author: "AUTHOR" },
      });
    }

    const results = await Promise.allSettled(
      numArray.map((i) =>
        service.createLoan(
          { params: { memberCode: member.code } },
          { bookCode: `TEST-BOOK-${i}` },
        ),
      ),
    );

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled.length).toBe(2);
    expect(rejected.length).toBe(13);

    rejected.forEach((error) => {
      expect(error.reason).toBeInstanceOf(MemberLoanLimitException);
    });
  });

  it("CASE 3: MULTIPLE MEMBERS LOAN THE SAME BOOK CONCURRENTLY", async () => {
    const book = await prisma.book.create({
      data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR" },
    });

    const createLoanRequest = (memberCode: string) =>
      service.createLoan({ params: { memberCode } }, { bookCode: book.code });

    const members = await Promise.all([
      prisma.member.create({ data: { code: "TEST-MEMBER-1", name: "TEST" } }),
      prisma.member.create({ data: { code: "TEST-MEMBER-2", name: "TEST" } }),
      prisma.member.create({ data: { code: "TEST-MEMBER-3", name: "TEST" } }),
      prisma.member.create({ data: { code: "TEST-MEMBER-4", name: "TEST" } }),
    ]);

    const results = await Promise.allSettled(
      members.map((member) => createLoanRequest(member.code)),
    );

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(3);

    rejected.forEach((error) => {
      expect(error.reason).toBeInstanceOf(BookOutOFStockException);
    });
  });
});

describe("LoanService - Concurrent Loan Return", () => {
  it("CASE 1: ONE MEMBER RETURNS ONE BOOK CONCURRENTLY", async () => {
    const member = await prisma.member.create({
      data: { code: "TEST-MEMBER-01", name: "TEST", loanCount: 1 },
    });
    const book = await prisma.book.create({
      data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR", stock: 0 },
    });
    await prisma.loan.create({
      data: {
        memberCode: member.code,
        bookCode: book.code,
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
        isActive: true,
      },
    });

    const returnLoanRequest = () =>
      service.returnLoan(
        { params: { memberCode: member.code } },
        { bookCode: book.code },
      );

    const results = await Promise.allSettled([
      returnLoanRequest(),
      returnLoanRequest(),
      returnLoanRequest(),
      returnLoanRequest(),
      returnLoanRequest(),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(4);

    rejected.forEach((error) => {
      expect(error.reason).toBeInstanceOf(LoanNotFoundException);
    });
  });

  it("CASE 2: ONE MEMBER RETURNS MULTIPLE BOOKS CONCURRENTLY", async () => {
    const member = await prisma.member.create({
      data: { code: "TEST-MEMBER-01", name: "TEST", loanCount: 2 },
    });

    const numArray = generateIncrementingArray(2);
    for (const i of numArray) {
      await prisma.book.create({
        data: {
          code: `TEST-BOOK-${i}`,
          title: `TITLE-${i}`,
          author: "AUTHOR",
          stock: 0,
        },
      });
      await prisma.loan.create({
        data: {
          memberCode: member.code,
          bookCode: `TEST-BOOK-${i}`,
          createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
          isActive: true,
        },
      });
    }

    const results = await Promise.allSettled(
      numArray.map((i) =>
        service.returnLoan(
          { params: { memberCode: member.code } },
          { bookCode: `TEST-BOOK-${i}` },
        ),
      ),
    );

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");

    expect(fulfilled.length).toBe(2);
    expect(rejected.length).toBe(0);
  });
});
