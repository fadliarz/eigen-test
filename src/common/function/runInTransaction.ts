import asyncLocalStorage from "../others/asyncLocalStorage";
import { LocalStorageKey } from "../enum/enum";
import PrismaClientSingleton from "../class/PrismaClientSingleton";

export default async function runInTransaction<T>(
  fn: () => Promise<T>,
): Promise<T> {
  const prisma = PrismaClientSingleton.getInstance();

  return prisma.$transaction(async (tx) => {
    return await asyncLocalStorage.run(
      { [LocalStorageKey.TRANSACTION]: tx },
      fn,
    );
  });
}
