"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MemberRouter;
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const member_type_1 = require("../member.type");
function MemberRouter() {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(member_type_1.MemberDITypes.CONTROLLER);
    router.get("/members", controller.getMembers.bind(controller));
    return router;
}
