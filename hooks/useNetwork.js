import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

export function useNetwork() {
  const [network, setNetwork] = useState(null);
  const { active, library } = useWeb3React();

  useEffect(() => {
    async function fetchNetwork() {
      try {
        if (active) {
          const currentNetwork = await library.getNetwork();
          setNetwork(currentNetwork);
        }
      } catch (error) {
        console.error(`[fetchNetwork] getting network failed`, error);
      }
    }
    fetchNetwork();
  }, [active, library]);

  return network;
}
