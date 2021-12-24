import { Percent } from '@uniswap/sdk-core';

export const SUPPORTED_CHAIN_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
};

export const UNISWAP_INTERFACE_MULTICALL_ADDRESS =
  '0x1F98415757620B543A52E61c46B32eB19261F984';

export const V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

// https://dev.sushi.com/sushiswap/contracts
export const SUSHI_ROLL_ADDRESS = Object.values(SUPPORTED_CHAIN_IDS).reduce(
  (acc, chainId) => {
    acc[chainId] =
      chainId === SUPPORTED_CHAIN_IDS.MAINNET
        ? '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
        : '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5';
    return acc;
  },
  {}
);

export const DEFAULT_DEADLINE = 10 * 60; // 10 minutes

export const DEFAULT_SIGNIFICANT_DIGITS_UI = 6;

export const DEFAULT_SLIPPAGE_TOLERANCE = new Percent(5, 100);

export const LOCAL_STORAGE_PREFIX = 'SUSHI_MIGRATOR';
