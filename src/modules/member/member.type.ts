export type MemberModel = {
  code: string;
  name: string;
  penaltyUntil: Date | null;
  loanCount: number;
  version: number;
};

export const MemberDITypes = {
  REPOSITORY: Symbol.for("MEMBER_REPOSITORY"),
  SERVICE: Symbol.for("MEMBER_SERVICE"),
  CONTROLLER: Symbol.for("MEMBER_CONTROLLER"),
} as const;
