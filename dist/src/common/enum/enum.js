"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageKey = exports.ErrorCode = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
    StatusCode[StatusCode["NO_CONTENT"] = 200] = "NO_CONTENT";
    StatusCode[StatusCode["RESOURCE_CREATED"] = 201] = "RESOURCE_CREATED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHENTICATED"] = 401] = "UNAUTHENTICATED";
    StatusCode[StatusCode["UNAUTHORIZED"] = 403] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHENTICATED"] = "LMS3000";
    ErrorCode["UNAUTHORIZED"] = "LMS3001";
    ErrorCode["FORBIDDEN"] = "LMS3003";
    ErrorCode["BAD_REQUEST"] = "LMS4000";
    ErrorCode["INVALID_QUERY"] = "LMS4001";
    ErrorCode["INVALID_PARAMS"] = "LMS4002";
    ErrorCode["INVALID_BODY"] = "LMS4003";
    ErrorCode["FAILED_ON_AUTHENTICATION"] = "LMS4004";
    ErrorCode["FOREIGN_KEY_CONSTRAINT"] = "LMS4020";
    ErrorCode["UNIQUE_CONSTRAINT"] = "LMS4021";
    ErrorCode["NON_EXISTENT_RESOURCE"] = "LMS4022";
    ErrorCode["RESOURCE_NOT_FOUND"] = "LMS4040";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "LMS5000";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
var LocalStorageKey;
(function (LocalStorageKey) {
    LocalStorageKey["TRANSACTION"] = "TRANSACTION";
})(LocalStorageKey || (exports.LocalStorageKey = LocalStorageKey = {}));
