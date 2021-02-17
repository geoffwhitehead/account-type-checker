import { accountTypeChecker } from ".";
import { AccountBalanceEntry, AccountType } from "./types";

const balanceFactory = (
  monthNumber: number,
  amount: number
): AccountBalanceEntry => {
  return {
    monthNumber,
    account: {
      balance: {
        amount,
      },
    },
  };
};

const generateFromTuples = (plots: number[][]) => {
  return plots.map(([x, y]) => balanceFactory(x, y));
};

type TestData = {
  accountBalanceHistory: AccountBalanceEntry[];
  expected: AccountType;
};

describe("accountTypeChecker", () => {
  it("correctly calculates fixed rates", () => {
    const tests: TestData[] = [
      {
        accountBalanceHistory: generateFromTuples([
          [0, 0],
          [1, 100],
          [2, 200],
        ]),
        expected: AccountType.fixed,
      },
      {
        accountBalanceHistory: generateFromTuples([[0, 10]]),
        expected: AccountType.fixed,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [0, 10],
          [0, 200],
        ]),
        expected: AccountType.fixed,
      },
      // {
      //   accountBalanceHistory: generateFromTuples([
      //     [0, -50],
      //     [1, 0],
      //     [2, 50],
      //   ]),
      //   expected: AccountType.fixed,
      // },
      {
        accountBalanceHistory: generateFromTuples([
          [0, -100],
          [1, 23],
          [2, 146],
        ]),
        expected: AccountType.fixed,
      },
    ];

    tests.forEach(({ accountBalanceHistory, expected }) => {
      const actual = accountTypeChecker(accountBalanceHistory);
      expect(actual).toEqual(expected);
    });
  });

  it("correctly calculates variable rates", () => {
    const tests: TestData[] = [
      {
        accountBalanceHistory: generateFromTuples([
          [0, -100],
          [1, 100],
          [2, 200],
        ]),
        expected: AccountType.variable,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [0, 11],
          [1, 20],
          [2, 30],
        ]),
        expected: AccountType.variable,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [0, 123],
          [1, 456],
          [2, 789],
          [3, 1000],
        ]),
        expected: AccountType.variable,
      },
    ];
    tests.forEach(({ accountBalanceHistory, expected }) => {
      const actual = accountTypeChecker(accountBalanceHistory);
      expect(actual).toEqual(expected);
    });
  });

  it("correctly calculates without current month", () => {
    const tests: TestData[] = [
      {
        accountBalanceHistory: generateFromTuples([
          [1, 25],
          [2, 51],
          [3, 74],
        ]),
        expected: AccountType.variable,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [1, 27],
          [2, 123],
          [3, 342],
        ]),
        expected: AccountType.variable,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [1, 10],
          [2, 20],
          [3, 30],
        ]),
        expected: AccountType.fixed,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [1, 1220],
          [2, 2440],
          [3, 3660],
        ]),
        expected: AccountType.fixed,
      },
    ];

    tests.forEach(({ accountBalanceHistory, expected }) => {
      const actual = accountTypeChecker(accountBalanceHistory);
      expect(actual).toEqual(expected);
    });
  });

  it("correctly calculates with unsorted data", () => {
    const tests: TestData[] = [
      {
        accountBalanceHistory: generateFromTuples([
          [2, 200],
          [0, 0],
          [1, 100],
        ]),
        expected: AccountType.fixed,
      },
      {
        accountBalanceHistory: generateFromTuples([
          [2, 100],
          [1, 20],
          [0, 0],
        ]),
        expected: AccountType.variable,
      },
    ];

    tests.forEach(({ accountBalanceHistory, expected }) => {
      const actual = accountTypeChecker(accountBalanceHistory);
      expect(actual).toEqual(expected);
    });
  });
});
