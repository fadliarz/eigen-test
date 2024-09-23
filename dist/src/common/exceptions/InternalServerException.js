"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const enum_1 = require("../enum/enum");
const shared_1 = require("../shared");
class InternalServerException extends HttpException_1.default {
    constructor(message) {
        super(enum_1.StatusCode.SERVER_ERROR, enum_1.ErrorCode.INTERNAL_SERVER_ERROR, message || shared_1.ErrorMessage[enum_1.ErrorCode.INTERNAL_SERVER_ERROR], true);
    }
}
exports.default = InternalServerException;
