export type LoanModel = {
  id: number;
  bookCode: string;
  memberCode: string;
  isActive: boolean;
  createdAt: Date;
};

export const LoanDITypes = {
  REPOSITORY: Symbol.for("LOAN_REPOSITORY"),
  SERVICE: Symbol.for("LOAN_SERVICE"),
  CONTROLLER: Symbol.for("LOAN_CONTROLLER"),
} as const;
