import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import getPrismaDb from "../function/getPrismaDb";
import asyncLocalStorage from "../others/asyncLocalStorage";
import { Transaction } from "../shared";

@injectable()
export default abstract class BaseRepository {
  protected db: Transaction | PrismaClient;

  constructor() {
    this.wrapMethods();
  }

  protected wrapMethods() {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    ).filter(
      (name) =>
        name !== "constructor" && typeof (this as any)[name] === "function",
    );

    methodNames.forEach((methodName) => {
      const originalMethod = (this as any)[methodName];
      (this as any)[methodName] = (...args: any[]) => {
        this.db = getPrismaDb(asyncLocalStorage);
        return originalMethod.apply(this, args);
      };
    });
  }
}
