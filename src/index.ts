export type AccountBalanceEntry = {
  monthNumber: number;
  account: {
    balance: {
      amount: number;
    };
  };
};

type Plot = { x: number; y: number };

export enum AccountType {
  variable = "A",
  fixed = "B",
}

type GetYInterceptProps = {
  plot: Plot;
  gradient: number;
};

const getYIntercept = ({ plot, gradient }: GetYInterceptProps): number => {
  const isCurrentMonth = plot.x === 0;

  if (isCurrentMonth) {
    return plot.y;
  } else {
    return gradient * plot.x - plot.y;
  }
};

export const accountTypeChecker = (
  accountBalanceHistory: AccountBalanceEntry[]
): AccountType => {
  if (accountBalanceHistory.length <= 2) {
    return AccountType.fixed;
  }

  const plots: Plot[] = accountBalanceHistory.map((entry) => ({
    x: entry.monthNumber,
    y: entry.account.balance.amount,
  }));

  const changeY = plots[plots.length - 1].y - plots[0].y;
  const changeX = plots[plots.length - 1].x - plots[0].x;
  const gradient = changeY / changeX;

  const yIntercept = getYIntercept({ plot: plots[0], gradient });

  const isVariable = plots.some((plot) => {
    const linearY = gradient * plot.x + yIntercept;
    return plot.y !== linearY;
  });

  return isVariable ? AccountType.variable : AccountType.fixed;
};
