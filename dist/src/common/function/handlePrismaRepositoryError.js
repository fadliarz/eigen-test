"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handlePrismaRepositoryError;
const client_1 = require("@prisma/client");
const shared_1 = require("../shared");
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
const enum_1 = require("../enum/enum");
const RecordNotFoundException_1 = __importDefault(require("../exceptions/RecordNotFoundException"));
const InternalServerException_1 = __importDefault(require("../exceptions/InternalServerException"));
function handlePrismaRepositoryError(error, constraint) {
    var _a, _b;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === shared_1.PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
            const defaultError = new HttpException_1.default(enum_1.StatusCode.BAD_REQUEST, enum_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, error.message);
            if (!constraint || !constraint.foreignConstraint) {
                return defaultError;
            }
            const field = error.message.split("field: ")[1];
            const { foreignConstraint } = constraint;
            if (foreignConstraint.hasOwnProperty(field)) {
                return foreignConstraint[field];
            }
            return foreignConstraint.default || defaultError;
        }
        if (error.code === shared_1.PrismaErrorCode.UNIQUE_CONSTRAINT) {
            const defaultError = new HttpException_1.default(enum_1.StatusCode.BAD_REQUEST, enum_1.ErrorCode.UNIQUE_CONSTRAINT, error.message);
            if (!constraint || !constraint.uniqueConstraint) {
                return defaultError;
            }
            const field = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target).join("&");
            const { uniqueConstraint } = constraint;
            if (uniqueConstraint.hasOwnProperty(field)) {
                return uniqueConstraint[field];
            }
            return uniqueConstraint.default || defaultError;
        }
        if (error.code === shared_1.PrismaErrorCode.RECORD_NOT_FOUND) {
            return ((_b = constraint === null || constraint === void 0 ? void 0 : constraint.recordNotFound) === null || _b === void 0 ? void 0 : _b.default)
                ? constraint.recordNotFound.default
                : new RecordNotFoundException_1.default();
        }
    }
    return error instanceof HttpException_1.default ? error : new InternalServerException_1.default();
}
