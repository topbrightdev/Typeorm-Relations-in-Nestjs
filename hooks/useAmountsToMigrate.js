import { useMemo } from 'react';
import { CurrencyAmount, Percent } from '@uniswap/sdk-core';

import { useCopiedTokensData } from 'context';
import { isPercentage } from 'utils';
import { useLPPosition } from './useLPPosition';

export function useAmountsToMigrate(percentage) {
  const { token0, token1 } = useCopiedTokensData();
  const [userPoolBalance, token0Deposited, token1Deposited] = useLPPosition(
    token0,
    token1
  );

  return useMemo(() => {
    if (
      isPercentage(percentage) &&
      Number.parseFloat(percentage) > 0 &&
      userPoolBalance &&
      token0Deposited &&
      token1Deposited
    ) {
      const parsedPercentage = Math.floor(Number.parseFloat(percentage) * 100);
      const percent = new Percent(parsedPercentage, 10_000);
      const lpTokenAmount = CurrencyAmount.fromRawAmount(
        userPoolBalance.currency,
        percent.multiply(userPoolBalance.quotient).quotient
      );
      const token0Amount = CurrencyAmount.fromRawAmount(
        token0Deposited.currency,
        percent.multiply(token0Deposited.quotient).quotient
      );
      const token1Amount = CurrencyAmount.fromRawAmount(
        token1Deposited.currency,
        percent.multiply(token1Deposited.quotient).quotient
      );

      return [lpTokenAmount, token0Amount, token1Amount];
    }
    return [];
  }, [percentage, userPoolBalance, token0Deposited, token1Deposited]);
}
