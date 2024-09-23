"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(status, errorCode, customMessage, isOperational = false) {
        super(customMessage.toString());
        this.status = status;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
    }
}
exports.default = HttpException;
