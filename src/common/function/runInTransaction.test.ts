import PrismaClientSingleton from "../class/PrismaClientSingleton";
import { MemberModel } from "../../modules/member/member.type";
import { Prisma } from "@prisma/client";
import { GlobalDITypes, IRepository } from "../shared";
import dIContainer from "../../inversifyConfig";
import runInTransaction from "./runInTransaction";

let member: MemberModel;
let repository: IRepository;

async function refreshMember(): Promise<void> {
  const prisma = PrismaClientSingleton.getInstance();

  member = (await prisma.member.findUnique({
    where: { code: "TEST-01" },
  })) as MemberModel;
}

beforeEach(async () => {
  repository = dIContainer.get<IRepository>(GlobalDITypes.REPOSITORY);

  const prisma = PrismaClientSingleton.getInstance();

  const tableNames = Object.values(Prisma.ModelName);

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
    );
  }

  member = await prisma.member.create({
    data: { code: "TEST-01", name: "TEST", loanCount: 1 },
  });
});

describe("runInTransaction", () => {
  it("", async () => {
    expect(member.loanCount).toEqual(1);

    try {
      await runInTransaction(async () => {
        await repository.member.updateMember("TEST-01", { loanCount: 1000 });

        await refreshMember();

        expect(member.loanCount).toEqual(1000);

        throw new Error();
      });
    } catch (error) {
      await refreshMember();
    }

    expect(member.loanCount).toEqual(1);
  });
});
