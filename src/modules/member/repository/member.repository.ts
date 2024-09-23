import { injectable } from "inversify";
import { IMemberRepository } from "../member.interface";
import { MemberModel } from "../member.type";
import BaseRepository from "../../../common/class/BaseRepository";
import handlePrismaRepositoryError from "../../../common/function/handlePrismaRepositoryError";

@injectable()
export default class MemberRepository
  extends BaseRepository
  implements IMemberRepository
{
  constructor() {
    super();
  }

  public async getMembers(): Promise<MemberModel[]> {
    try {
      return await this.db.member.findMany();
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async getMemberByCode(code: string): Promise<MemberModel | null> {
    try {
      return await this.db.member.findUnique({
        where: {
          code,
        },
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }

  public async updateMember(
    code: string,
    data: Partial<MemberModel>,
    where?: {
      version?: number;
    },
  ): Promise<MemberModel> {
    try {
      return await this.db.member.update({
        where: {
          code,
          ...(where?.version ? { version: where.version } : {}),
        },
        data,
      });
    } catch (error: any) {
      throw handlePrismaRepositoryError(error);
    }
  }
}
