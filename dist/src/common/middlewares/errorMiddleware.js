"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const InternalServerException_1 = __importDefault(require("../exceptions/InternalServerException"));
function errorMiddleware(error, req, res, next) {
    console.log("[@errorMiddleware error]: ", error);
    let statusCode;
    let errorCode;
    let message;
    if (!(error instanceof HttpException_1.default)) {
        error = new InternalServerException_1.default();
    }
    statusCode = error.status;
    message = error.message;
    errorCode = error.errorCode;
    return res.status(statusCode).json({
        error: {
            errorCode,
            message,
        },
    });
}
