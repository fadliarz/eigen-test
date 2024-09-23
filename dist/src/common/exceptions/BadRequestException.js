"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const enum_1 = require("../enum/enum");
class BadRequestException extends HttpException_1.default {
    constructor(message) {
        super(enum_1.StatusCode.BAD_REQUEST, enum_1.ErrorCode.BAD_REQUEST, message || "bad request!", true);
    }
}
exports.default = BadRequestException;
