"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const enum_1 = require("../enum/enum");
const shared_1 = require("../shared");
class RecordNotFoundException extends HttpException_1.default {
    constructor(message) {
        super(enum_1.StatusCode.NOT_FOUND, enum_1.ErrorCode.RESOURCE_NOT_FOUND, message || shared_1.ErrorMessage[enum_1.ErrorCode.RESOURCE_NOT_FOUND], true);
    }
}
exports.default = RecordNotFoundException;
