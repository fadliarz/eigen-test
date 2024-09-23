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
const PrismaClientSingleton_1 = __importDefault(require("../class/PrismaClientSingleton"));
const client_1 = require("@prisma/client");
const shared_1 = require("../shared");
const inversifyConfig_1 = __importDefault(require("../../inversifyConfig"));
const runInTransaction_1 = __importDefault(require("./runInTransaction"));
let member;
let repository;
function refreshMember() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = PrismaClientSingleton_1.default.getInstance();
        member = (yield prisma.member.findUnique({
            where: { code: "TEST-01" },
        }));
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    repository = inversifyConfig_1.default.get(shared_1.GlobalDITypes.REPOSITORY);
    const prisma = PrismaClientSingleton_1.default.getInstance();
    const tableNames = Object.values(client_1.Prisma.ModelName);
    for (const tableName of tableNames) {
        yield prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
    }
    member = yield prisma.member.create({
        data: { code: "TEST-01", name: "TEST", loanCount: 1 },
    });
}));
describe("runInTransaction", () => {
    it("", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(member.loanCount).toEqual(1);
        try {
            yield (0, runInTransaction_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield repository.member.updateMember("TEST-01", { loanCount: 1000 });
                yield refreshMember();
                expect(member.loanCount).toEqual(1000);
                throw new Error();
            }));
        }
        catch (error) {
            yield refreshMember();
        }
        expect(member.loanCount).toEqual(1);
    }));
});
