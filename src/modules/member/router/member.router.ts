import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IMemberController } from "../member.interface";
import { MemberDITypes } from "../member.type";

export default function MemberRouter() {
  const router = express.Router();

  const controller = dIContainer.get<IMemberController>(
    MemberDITypes.CONTROLLER,
  );

  router.get("/members", controller.getMembers.bind(controller));

  return router;
}
