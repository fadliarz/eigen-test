"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoanRouter;
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const loan_type_1 = require("../loan.type");
function LoanRouter() {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(loan_type_1.LoanDITypes.CONTROLLER);
    router.post("/members/:memberCode/loan-book", controller.createLoan.bind(controller));
    router.post("/members/:memberCode/return-book", controller.returnLoan.bind(controller));
    return router;
}
