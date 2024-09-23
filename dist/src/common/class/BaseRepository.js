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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const getPrismaDb_1 = __importDefault(require("../function/getPrismaDb"));
const asyncLocalStorage_1 = __importDefault(require("../others/asyncLocalStorage"));
let BaseRepository = class BaseRepository {
    constructor() {
        this.wrapMethods();
    }
    wrapMethods() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter((name) => name !== "constructor" && typeof this[name] === "function");
        methodNames.forEach((methodName) => {
            const originalMethod = this[methodName];
            this[methodName] = (...args) => {
                this.db = (0, getPrismaDb_1.default)(asyncLocalStorage_1.default);
                return originalMethod.apply(this, args);
            };
        });
    }
};
BaseRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BaseRepository);
exports.default = BaseRepository;
