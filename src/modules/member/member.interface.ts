import {NextFunction, Request, Response} from "express";
import {MemberModel} from "./member.type";

export interface IMemberController {
    getMembers: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>
}

export interface IMemberService {
    getMembers: () => Promise<MemberModel[]>
}

export interface IMemberRepository {
    getMembers: () => Promise<MemberModel[]>
    getMemberByCode: (code: string) => Promise<MemberModel | null>;
    updateMember: (code: string, data: Partial<MemberModel>, where?: { version?: number }) => Promise<MemberModel>;
}

