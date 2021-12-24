import { useEffect, useState } from 'react';
import { computePairAddress, Pair } from '@uniswap/v2-sdk';
import { CurrencyAmount } from '@uniswap/sdk-core';

import { useToken } from './useToken';
import { useV2pairContract } from './useContract';
import { V2_FACTORY_ADDRESS } from 'config';

export function useV2Pair(token0Address, token1Address) {
  const [pairAddress, setPairAddress] = useState('');
  const [reserves, setReserves] = useState(null);
  const [pair, setPair] = useState(null);
  const pairContract = useV2pairContract(pairAddress);
  const [tokenA] = useToken(token0Address);
  const [tokenB] = useToken(token1Address);

  useEffect(() => {
    if (tokenA && tokenB) {
      const computedPairAddress = computePairAddress({
        factoryAddress: V2_FACTORY_ADDRESS,
        tokenA,
        tokenB,
      });
      setPairAddress(computedPairAddress);
    }
  }, [tokenA, tokenB]);

  useEffect(() => {
    if (pairContract) {
      console.log({ pairContract });
      const getReserves = async () => {
        const reservesRes = await pairContract.getReserves();
        setReserves(reservesRes);
      };
      getReserves();
    }
  }, [pairContract]);

  useEffect(() => {
    if (reserves && tokenA && tokenB) {
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
      const pair = new Pair(
        CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
        CurrencyAmount.fromRawAmount(token1, reserve1.toString())
      );
      setPair(pair);
    }
  }, [reserves, tokenA, tokenB]);

  return pair;
}
