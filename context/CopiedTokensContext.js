import { createContext, useContext, useEffect } from 'react';
import { useLocalstorageState, usePreviousDifferent } from 'rooks';
import copy from 'copy-text-to-clipboard';
import { ethers } from 'ethers';

import { useNetwork } from 'hooks';
import { LOCAL_STORAGE_PREFIX } from 'config';

const CopiedTokensData = createContext(null);

export function CopiedTokensProvider({ children }) {
  const network = useNetwork();
  const previousChainId = usePreviousDifferent(network?.chainId);

  const [fstTokenWasCopied, setFstTokenWasCopied] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_LAST_TOKEN_COPIED`,
    true
  );
  const [token0, setToken0] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_TOKEN0`,
    ''
  );
  const [token1, setToken1] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_TOKEN1`,
    ''
  );
  const [token0Error, setToken0Error] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_TOKEN0_ERROR`,
    ''
  );
  const [token1Error, setToken1Error] = useLocalstorageState(
    `${LOCAL_STORAGE_PREFIX}_TOKEN1_ERROR`,
    ''
  );

  useEffect(() => {
    if (
      network?.chainId &&
      previousChainId &&
      network.chainId !== previousChainId
    ) {
      setToken0('');
      setToken1('');
      setToken0Error('');
      setToken1Error('');
      setFstTokenWasCopied(true);
    }
  }, [
    network?.chainId,
    previousChainId,
    setToken0,
    setToken1,
    setToken0Error,
    setToken1Error,
    setFstTokenWasCopied,
  ]);

  useEffect(() => {
    if (token0) {
      const isAddress = ethers.utils.isAddress(token0);
      setToken0Error(isAddress ? '' : 'Address is not valid');
    }
  }, [token0, setToken0Error]);

  useEffect(() => {
    if (token1) {
      const isAddress = ethers.utils.isAddress(token1);
      setToken1Error(isAddress ? '' : 'Address is not valid');
    }
  }, [token1, setToken1Error]);

  const handleCopyToken = (newTokenAddress) => {
    copy(newTokenAddress);
    if (fstTokenWasCopied) {
      setToken0(newTokenAddress);
      setFstTokenWasCopied(false);
    } else {
      setToken1(newTokenAddress);
      setFstTokenWasCopied(true);
    }
  };

  return (
    <CopiedTokensData.Provider
      value={{
        token0,
        token1,
        setToken0,
        setToken1,
        handleCopyToken,
        token0Error,
        token1Error,
      }}
    >
      {children}
    </CopiedTokensData.Provider>
  );
}

export const useCopiedTokensData = () => useContext(CopiedTokensData);
