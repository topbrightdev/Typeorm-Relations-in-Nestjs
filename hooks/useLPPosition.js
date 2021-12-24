import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useV2Pair } from './useV2Pair';
import { useTokenBalance } from './useTokenBalance';
import { useTotalSupply } from './useTotalSupply';

export function useLPPosition(token0Address, token1Address) {
  const { account } = useWeb3React();
  const pair = useV2Pair(token0Address, token1Address);
  const userPoolBalance = useTokenBalance(account, pair?.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken);

  return useMemo(() => {
    let token0Deposited = null;
    let token1Deposited = null;
    if (pair && userPoolBalance && totalPoolTokens) {
      console.log({ pair });
      token0Deposited = pair.getLiquidityValue(
        pair.token0,
        totalPoolTokens,
        userPoolBalance,
        false
      );
      token1Deposited = pair.getLiquidityValue(
        pair.token1,
        totalPoolTokens,
        userPoolBalance,
        false
      );
    }
    return [userPoolBalance, token0Deposited, token1Deposited];
  }, [totalPoolTokens, userPoolBalance, pair]);
}
