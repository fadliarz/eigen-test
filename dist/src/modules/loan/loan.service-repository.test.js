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
require("reflect-metadata");
const inversifyConfig_1 = __importDefault(require("../../inversifyConfig"));
const loan_type_1 = require("./loan.type");
const PrismaClientSingleton_1 = __importDefault(require("../../common/class/PrismaClientSingleton"));
const client_1 = require("@prisma/client");
const BookOutOFStockException_1 = __importDefault(require("./exceptions/BookOutOFStockException"));
const MemberLoanLimitException_1 = __importDefault(require("./exceptions/MemberLoanLimitException"));
const LoanNotFoundException_1 = __importDefault(require("./exceptions/LoanNotFoundException"));
let service;
let prisma;
function generateIncrementingArray(size) {
    return Array.from({ length: size }, (_, index) => index);
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    prisma = PrismaClientSingleton_1.default.getInstance();
    service = inversifyConfig_1.default.get(loan_type_1.LoanDITypes.SERVICE);
    const tableNames = Object.values(client_1.Prisma.ModelName);
    for (const tableName of tableNames) {
        yield prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
    }
}));
describe("LoanService - Concurrent Loan Creation", () => {
    it("CASE 1: ONE MEMBER LOANS THE SAME BOOK CONCURRENTLY", () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield prisma.member.create({
            data: { code: "TEST-MEMBER-01", name: "TEST" },
        });
        const book = yield prisma.book.create({
            data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR" },
        });
        const createLoanRequest = () => service.createLoan({ params: { memberCode: member.code } }, { bookCode: book.code });
        const results = yield Promise.allSettled([
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
            expect(error.reason).toBeInstanceOf(BookOutOFStockException_1.default);
        });
    }));
    it("CASE 2: ONE MEMBER LOANS MULTIPLE BOOKS CONCURRENTLY", () => __awaiter(void 0, void 0, void 0, function* () {
        const prisma = PrismaClientSingleton_1.default.getInstance();
        const member = yield prisma.member.create({
            data: { code: "TEST-MEMBER-01", name: "TEST" },
        });
        const numArray = generateIncrementingArray(15);
        for (const i of numArray) {
            yield prisma.book.create({
                data: { code: `TEST-BOOK-${i}`, title: "TITLE", author: "AUTHOR" },
            });
        }
        const results = yield Promise.allSettled(numArray.map((i) => service.createLoan({ params: { memberCode: member.code } }, { bookCode: `TEST-BOOK-${i}` })));
        const fulfilled = results.filter((result) => result.status === "fulfilled");
        const rejected = results.filter((result) => result.status === "rejected");
        expect(fulfilled.length).toBe(2);
        expect(rejected.length).toBe(13);
        rejected.forEach((error) => {
            expect(error.reason).toBeInstanceOf(MemberLoanLimitException_1.default);
        });
    }));
    it("CASE 3: MULTIPLE MEMBERS LOAN THE SAME BOOK CONCURRENTLY", () => __awaiter(void 0, void 0, void 0, function* () {
        const book = yield prisma.book.create({
            data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR" },
        });
        const createLoanRequest = (memberCode) => service.createLoan({ params: { memberCode } }, { bookCode: book.code });
        const members = yield Promise.all([
            prisma.member.create({ data: { code: "TEST-MEMBER-1", name: "TEST" } }),
            prisma.member.create({ data: { code: "TEST-MEMBER-2", name: "TEST" } }),
            prisma.member.create({ data: { code: "TEST-MEMBER-3", name: "TEST" } }),
            prisma.member.create({ data: { code: "TEST-MEMBER-4", name: "TEST" } }),
        ]);
        const results = yield Promise.allSettled(members.map((member) => createLoanRequest(member.code)));
        const fulfilled = results.filter((result) => result.status === "fulfilled");
        const rejected = results.filter((result) => result.status === "rejected");
        expect(fulfilled.length).toBe(1);
        expect(rejected.length).toBe(3);
        rejected.forEach((error) => {
            expect(error.reason).toBeInstanceOf(BookOutOFStockException_1.default);
        });
    }));
});
describe("LoanService - Concurrent Loan Return", () => {
    it("CASE 1: ONE MEMBER RETURNS ONE BOOK CONCURRENTLY", () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield prisma.member.create({
            data: { code: "TEST-MEMBER-01", name: "TEST", loanCount: 1 },
        });
        const book = yield prisma.book.create({
            data: { code: "TEST-BOOK-1", title: "TITLE", author: "AUTHOR", stock: 0 },
        });
        yield prisma.loan.create({
            data: {
                memberCode: member.code,
                bookCode: book.code,
                createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
                isActive: true,
            },
        });
        const returnLoanRequest = () => service.returnLoan({ params: { memberCode: member.code } }, { bookCode: book.code });
        const results = yield Promise.allSettled([
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
            expect(error.reason).toBeInstanceOf(LoanNotFoundException_1.default);
        });
    }));
    it("CASE 2: ONE MEMBER RETURNS MULTIPLE BOOKS CONCURRENTLY", () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield prisma.member.create({
            data: { code: "TEST-MEMBER-01", name: "TEST", loanCount: 2 },
        });
        const numArray = generateIncrementingArray(2);
        for (const i of numArray) {
            yield prisma.book.create({
                data: {
                    code: `TEST-BOOK-${i}`,
                    title: `TITLE-${i}`,
                    author: "AUTHOR",
                    stock: 0,
                },
            });
            yield prisma.loan.create({
                data: {
                    memberCode: member.code,
                    bookCode: `TEST-BOOK-${i}`,
                    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
                    isActive: true,
                },
            });
        }
        const results = yield Promise.allSettled(numArray.map((i) => service.returnLoan({ params: { memberCode: member.code } }, { bookCode: `TEST-BOOK-${i}` })));
        const fulfilled = results.filter((result) => result.status === "fulfilled");
        const rejected = results.filter((result) => result.status === "rejected");
        expect(fulfilled.length).toBe(2);
        expect(rejected.length).toBe(0);
    }));
});
