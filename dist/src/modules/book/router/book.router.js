"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookRouter;
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const book_type_1 = require("../book.type");
function BookRouter() {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(book_type_1.BookDITypes.CONTROLLER);
    router.get("/books", controller.getBooks.bind(controller));
    return router;
}
