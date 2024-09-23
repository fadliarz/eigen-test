"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_async_hooks_1 = require("node:async_hooks");
const asyncLocalStorage = new node_async_hooks_1.AsyncLocalStorage();
exports.default = asyncLocalStorage;
