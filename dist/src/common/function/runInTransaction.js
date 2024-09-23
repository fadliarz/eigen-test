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
exports.default = runInTransaction;
const asyncLocalStorage_1 = __importDefault(require("../others/asyncLocalStorage"));
const enum_1 = require("../enum/enum");
const PrismaClientSingleton_1 = __importDefault(require("../class/PrismaClientSingleton"));
function runInTransaction(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = PrismaClientSingleton_1.default.getInstance();
        return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            return yield asyncLocalStorage_1.default.run({ [enum_1.LocalStorageKey.TRANSACTION]: tx }, fn);
        }));
    });
}
