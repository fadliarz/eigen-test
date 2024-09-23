"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const member_type_1 = require("../../modules/member/member.type");
const book_type_1 = require("../../modules/book/book.type");
const loan_type_1 = require("../../modules/loan/loan.type");
let Repository = class Repository {
};
__decorate([
    (0, inversify_1.inject)(member_type_1.MemberDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "member", void 0);
__decorate([
    (0, inversify_1.inject)(book_type_1.BookDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "book", void 0);
__decorate([
    (0, inversify_1.inject)(loan_type_1.LoanDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "loan", void 0);
Repository = __decorate([
    (0, inversify_1.injectable)()
], Repository);
exports.default = Repository;
