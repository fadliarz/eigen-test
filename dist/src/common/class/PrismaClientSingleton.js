"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PrismaClientSingleton {
    constructor() { }
    static getInstance() {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new client_1.PrismaClient({});
        }
        return PrismaClientSingleton.instance;
    }
}
exports.default = PrismaClientSingleton;
