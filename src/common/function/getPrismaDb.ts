import { PrismaClient } from "@prisma/client";
import { AsyncLocalStorage } from "node:async_hooks";
import PrismaClientSingleton from "../class/PrismaClientSingleton";
import { Transaction } from "../shared";
import { LocalStorageKey } from "../enum/enum";

export default function getPrismaDb(
  asyncLocalStorage: AsyncLocalStorage<any>,
): Transaction | PrismaClient {
  let db: Transaction | PrismaClient = PrismaClientSingleton.getInstance();
  const store = asyncLocalStorage.getStore();

  if (store) {
    db = (store as any)[LocalStorageKey.TRANSACTION] as Transaction;
  }

  return db;
}
