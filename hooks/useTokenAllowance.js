import { useState, useEffect, useMemo } from 'react';
import { CurrencyAmount } from '@uniswap/sdk-core';

import { useTokenContract } from './useContract';

export function useTokenAllowance(token, owner, spender, refresh = false) {
  const [allowance, setAllowance] = useState(null);
  const tokenContract = useTokenContract(token?.address, false);

  useEffect(() => {
    const getAllowance = async () => {
      const allowanceResult = await tokenContract.allowance(owner, spender);
      setAllowance(allowanceResult);
    };
    if (tokenContract) {
      getAllowance();
    }
  }, [tokenContract, owner, spender, refresh]);

  return useMemo(
    () =>
      token && allowance
        ? CurrencyAmount.fromRawAmount(token, allowance.toString())
        : undefined,
    [token, allowance]
  );
}
