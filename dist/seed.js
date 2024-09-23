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
const PrismaClientSingleton_1 = __importDefault(require("./src/common/class/PrismaClientSingleton"));
const client_1 = require("@prisma/client");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = PrismaClientSingleton_1.default.getInstance();
        const tableNames = Object.values(client_1.Prisma.ModelName);
        for (const tableName of tableNames) {
            yield prisma.$queryRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
        }
        yield prisma.member.createMany({
            data: [
                {
                    code: "M001",
                    name: "Angga",
                },
                {
                    code: "M002",
                    name: "Ferry",
                },
                {
                    code: "M003",
                    name: "Putri",
                },
            ],
        });
        yield prisma.book.createMany({
            data: [
                {
                    code: "JK-45",
                    title: "Harry Potter",
                    author: "J.K Rowling",
                    stock: 1,
                },
                {
                    code: "SHR-1",
                    title: "A Study in Scarlet",
                    author: "Arthur Conan Doyle",
                    stock: 1,
                },
                {
                    code: "TW-11",
                    title: "Twilight",
                    author: "Stephenie Meyer",
                    stock: 1,
                },
                {
                    code: "HOB-83",
                    title: "The Hobbit, or There and Back Again",
                    author: "J.R.R. Tolkien",
                    stock: 1,
                },
                {
                    code: "NRN-7",
                    title: "The Lion, the Witch and the Wardrobe",
                    author: "C.S. Lewis",
                    stock: 1,
                },
            ],
        });
    });
}
main()
    .then(() => {
    console.log("Successfully seeding the database!");
})
    .catch((error) => {
    console.error("Error while seeding: ", error);
});
