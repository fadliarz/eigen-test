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
const app_1 = __importDefault(require("./app"));
const PrismaClientSingleton_1 = __importDefault(require("./common/class/PrismaClientSingleton"));
const member_router_1 = __importDefault(require("./modules/member/router/member.router"));
const book_router_1 = __importDefault(require("./modules/book/router/book.router"));
const loan_router_1 = __importDefault(require("./modules/loan/router/loan.router"));
const routers = [
    { router: (0, member_router_1.default)() },
    { router: (0, book_router_1.default)() },
    { router: (0, loan_router_1.default)() },
];
const port = Number(process.env.PORT) || 5000;
/**
 * Make instance of application
 *
 */
const app = new app_1.default(routers, port);
/**
 * Make instance of prisma
 *
 */
const prisma = PrismaClientSingleton_1.default.getInstance();
prisma
    .$connect()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Successfully establishing database connection!");
    app.express.listen(port, () => {
        console.log(`Server is running on the port ${port}`);
    });
}))
    .catch((error) => {
    console.log("Failed establishing a database connection!");
    console.error("error: ", error);
});
