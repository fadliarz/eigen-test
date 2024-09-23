"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RecordNotFoundException_1 = __importDefault(require("../../../common/exceptions/RecordNotFoundException"));
class MemberNotFoundException extends RecordNotFoundException_1.default {
    constructor(message) {
        super(message || "member not found!");
    }
}
exports.default = MemberNotFoundException;
