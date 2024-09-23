"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPrismaDb;
const PrismaClientSingleton_1 = __importDefault(require("../class/PrismaClientSingleton"));
const enum_1 = require("../enum/enum");
function getPrismaDb(asyncLocalStorage) {
    let db = PrismaClientSingleton_1.default.getInstance();
    const store = asyncLocalStorage.getStore();
    if (store) {
        db = store[enum_1.LocalStorageKey.TRANSACTION];
    }
    return db;
}
