import { useEffect, useState } from 'react';
import { CurrencyAmount } from '@uniswap/sdk-core';

import { useTokenContract } from './useContract';

export function useTokenBalance(address, token) {
  const [balance, setBalance] = useState(null);
  const tokenContract = useTokenContract(token?.address);

  useEffect(() => {
    if (tokenContract && address) {
      const getBalance = async () => {
        const balance = await tokenContract.balanceOf(address);
        setBalance(balance);
      };
      getBalance();
    }
  }, [tokenContract, address]);

  if (balance) {
    const amountRes = CurrencyAmount.fromRawAmount(token, balance.toString());
    return amountRes;
  }

  return balance;
}
