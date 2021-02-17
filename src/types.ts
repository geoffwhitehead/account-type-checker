export type AccountBalanceEntry = {
  monthNumber: number;
  account: {
    balance: {
      amount: number;
    };
  };
};

export enum AccountType {
  variable = "A",
  fixed = "B",
}
