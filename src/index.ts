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

const sorter = (a: Plot, b: Plot) => (a.x < b.x ? -1 : a.x > b.x ? 1 : 0);

type GetYInterceptProps = {
  plot: Plot;
  gradient: number;
};

const getYIntercept = ({ plot, gradient }: GetYInterceptProps): number => {
  const hasCurrentMonth = plot.x === 0;

  if (hasCurrentMonth) {
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

  const sortedPlots: Plot[] = accountBalanceHistory
    .map((entry) => ({
      x: entry.monthNumber,
      y: entry.account.balance.amount,
    }))
    .sort(sorter);

  const changeY = sortedPlots[sortedPlots.length - 1].y - sortedPlots[0].y;
  const changeX = sortedPlots[sortedPlots.length - 1].x - sortedPlots[0].x;
  const gradient = changeY / changeX;

  const yIntercept = getYIntercept({ plot: sortedPlots[0], gradient });

  const isVariable = sortedPlots.some((plot) => {
    const linearY = gradient * plot.x + yIntercept;
    return plot.y !== linearY;
  });

  return isVariable ? AccountType.variable : AccountType.fixed;
};
