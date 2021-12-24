import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalstorageState } from 'rooks';
import useSwr from 'swr';

import { useNetwork } from 'hooks';
import { LOCAL_STORAGE_PREFIX } from 'config';
import { fetcher } from 'utils';

const TokenListData = createContext(null);

export function TokenListProvider({ children }) {
  const [tokenData, setTokenData] = useState([]);
  const network = useNetwork();
  const { data, error: tokenDataError } = useSwr(
    `/api/tokens?chainId=${network?.chainId}`,
    fetcher
  );

  const [importedTokens, setImportedTokens] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_IMPORTED_TOKENS`,
    {}
  );

  useEffect(() => {
    setTokenData(data);
  }, [data]);

  const isTokenAvailable = (tokenAddress) => {
    if (network?.chainId && tokenAddress) {
      const tokensInChain = importedTokens[network.chainId];
      let tokenIsImported = false;
      if (tokensInChain) {
        tokenIsImported = tokensInChain.some((t) => t.address === tokenAddress);
      }
      const tokenInData = tokenData.some((t) => t.address === tokenAddress);
      return tokenIsImported || tokenInData;
    }
    return false;
  };

  const addToken = (token) => {
    if (network?.chainId) {
      const tokenIsAvailable = isTokenAvailable(token?.address);
      if (!tokenIsAvailable) {
        setImportedTokens((prevTokens) => {
          const previousInCurrentChain = prevTokens[network?.chainId];
          return {
            ...prevTokens,
            [network.chainId]: [
              {
                name: token?.name,
                address: token?.address,
                symbol: token?.symbol,
              },
              ...(previousInCurrentChain ? previousInCurrentChain : []),
            ],
          };
        });
      }
    }
  };

  const networkImportedTokens = importedTokens[network?.chainId];
  const completeData = [].concat(
    networkImportedTokens ? networkImportedTokens : [],
    tokenData ? tokenData : []
  );
  console.log({ completeData });

  return (
    <TokenListData.Provider
      value={{
        data: completeData,
        tokenDataError,
        addToken,
      }}
    >
      {children}
    </TokenListData.Provider>
  );
}

export const useTokenListData = () => useContext(TokenListData);
