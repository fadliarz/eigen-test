"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaErrorCode = exports.ErrorMessage = exports.GlobalDITypes = void 0;
const enum_1 = require("./enum/enum");
exports.GlobalDITypes = {
    REPOSITORY: Symbol.for("GLOBAL_REPOSITORY"),
};
exports.ErrorMessage = {
    [enum_1.ErrorCode.UNAUTHENTICATED]: "Unauthenticated, please login first!",
    [enum_1.ErrorCode.UNAUTHORIZED]: "Unauthorized, you are not allowed to do this operation!",
    [enum_1.ErrorCode.FORBIDDEN]: "Forbidden, you are not allowed to do this operation!",
    [enum_1.ErrorCode.BAD_REQUEST]: "BadRequest, unknown client side error!",
    [enum_1.ErrorCode.INVALID_QUERY]: "Invalid input query!",
    [enum_1.ErrorCode.INVALID_PARAMS]: "Invalid input parameter!",
    [enum_1.ErrorCode.INVALID_BODY]: "Invalid input body!",
    [enum_1.ErrorCode.FAILED_ON_AUTHENTICATION]: "Authentication failed!",
    [enum_1.ErrorCode.FOREIGN_KEY_CONSTRAINT]: (field) => {
        return `Foreign key constraint${field ? ` on field ${field}` : "!"}`;
    },
    [enum_1.ErrorCode.UNIQUE_CONSTRAINT]: (field) => {
        return `Unique constraint${field ? ` on field ${field}` : "!"}`;
    },
    [enum_1.ErrorCode.NON_EXISTENT_RESOURCE]: "Non-existent resource!",
    [enum_1.ErrorCode.RESOURCE_NOT_FOUND]: "Resource not found!",
    [enum_1.ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error, please try again later!",
    /**
     * Additional Key
     */
    NAN_PARAMS: (params) => {
        return `Invalid URL params on ${params} (one or more parameter is not a number)!`;
    },
};
exports.PrismaErrorCode = {
    UNIQUE_CONSTRAINT: "P2002",
    FOREIGN_KEY_CONSTRAINT: "P2003",
    RECORD_NOT_FOUND: "P2025",
};
