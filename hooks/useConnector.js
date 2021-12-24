import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { SUPPORTED_CHAIN_IDS } from '../config';

export const injected = new InjectedConnector({
  supportedChainIds: Object.values(SUPPORTED_CHAIN_IDS),
});

export function useConnector() {
  const { active, activate } = useWeb3React();

  useEffect(() => {
    async function activateConnection() {
      try {
        if (!active) {
          await activate(injected, undefined, true);
        }
      } catch (error) {
        console.error(`[activateConnection] active network failed`, error);
      }
    }
    activateConnection();
  }, [active, activate]);
}
