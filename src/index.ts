import { AccountBalanceEntry, AccountType } from "./types";

const getGradientAndIntercept = (
  acc: AccountBalanceEntry[]
): { gradient: number; yIntercept: number } => {
  const first = acc[0];
  const last = acc[acc.length - 1];
  const changeY = last.account.balance.amount - first.account.balance.amount;
  const changeX = last.monthNumber - first.monthNumber;
  const gradient = changeY / changeX;
  const yIntercept =
    gradient * first.monthNumber - first.account.balance.amount;

  return { yIntercept, gradient };
};

export const accountTypeChecker = (acc: AccountBalanceEntry[]): AccountType => {
  if (acc.length <= 2) {
    return AccountType.fixed;
  }

  const { gradient, yIntercept } = getGradientAndIntercept(acc);

  const hasVariablePayments = acc.some(
    ({ monthNumber, account }) =>
      account.balance.amount !== gradient * monthNumber + yIntercept
  );

  return hasVariablePayments ? AccountType.variable : AccountType.fixed;
};
