"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BadRequestException_1 = __importDefault(require("../../../common/exceptions/BadRequestException"));
class MemberIsPenalizedException extends BadRequestException_1.default {
    constructor(message) {
        super(message || "member is penalized!");
    }
}
exports.default = MemberIsPenalizedException;
