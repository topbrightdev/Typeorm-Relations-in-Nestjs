import { useEffect, useState } from 'react';
import { CurrencyAmount } from '@uniswap/sdk-core';

import { useTokenContract } from './useContract';

export function useTotalSupply(token) {
  const [totalSupply, setTotalSupply] = useState(null);
  const contract = useTokenContract(token?.address);

  useEffect(() => {
    if (contract) {
      const getTotalSupply = async () => {
        const totalSupplyRes = await contract.totalSupply();
        setTotalSupply(totalSupplyRes);
      };
      getTotalSupply();
    }
  }, [contract]);

  if (totalSupply) {
    const amount = CurrencyAmount.fromRawAmount(token, totalSupply.toString());
    return amount;
  }

  return totalSupply;
}
