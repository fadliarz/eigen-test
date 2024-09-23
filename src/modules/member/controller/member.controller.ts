import { inject, injectable } from "inversify";
import { IMemberController, IMemberService } from "../member.interface";
import { MemberDITypes } from "../member.type";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/enum/enum";

@injectable()
export default class MemberController implements IMemberController {
  @inject(MemberDITypes.SERVICE)
  private readonly service: IMemberService;

  public async getMembers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const members = await this.service.getMembers();

      return res.status(StatusCode.SUCCESS).json({ data: members });
    } catch (error) {
      next(error);
    }
  }
}
