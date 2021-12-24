import { useMemo, useEffect, useState } from 'react';
import { Token } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import ERC20_ABI from '../abis/erc20.json';
import ERC20_BYTES32_ABI from '../abis/erc20_bytes32.json';
import { useContract } from './useContract';

export function useToken(tokenAddress) {
  const { chainId } = useWeb3React();
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState('');

  const address = ethers.utils.isAddress(tokenAddress);
  const tokenContract = useContract(tokenAddress, ERC20_ABI);
  const tokenContractBytes32 = useContract(tokenAddress, ERC20_BYTES32_ABI);

  useEffect(() => {
    let mounted = true;
    if (mounted && tokenContract && tokenContractBytes32 && address) {
      const constructToken = async () => {
        await Promise.all([
          tokenContract?.name(),
          tokenContractBytes32?.name(),
          tokenContract?.symbol(),
          tokenContractBytes32?.name(),
          tokenContract?.decimals(),
        ])
          .then(
            ([
              tokenName,
              tokenNameBytes32,
              symbol,
              symbolBytes32,
              decimals,
            ]) => {
              setToken({
                tokenName,
                tokenNameBytes32,
                symbol,
                symbolBytes32,
                decimals,
              });
              setTokenError(null);
            }
          )
          .catch((e) => {
            setTokenError(e);
          });
      };
      constructToken();
    }
    return () => {
      mounted = false;
    };
  }, [tokenContract, tokenContractBytes32, address]);

  return useMemo(() => {
    if (tokenAddress === null) return [null, tokenError];
    if (!chainId || !address) return [null, tokenError];
    if (token?.decimals && token?.symbol) {
      const tokenWithError = [
        new Token(
          chainId,
          tokenAddress,
          token.decimals,
          token.symbol,
          token.tokenName
        ),
        tokenError,
      ];
      return tokenWithError;
    }
    return [null, tokenError];
  }, [address, chainId, token, tokenAddress, tokenError]);
}
