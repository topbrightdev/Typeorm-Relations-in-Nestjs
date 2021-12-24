import { useWeb3React } from '@web3-react/core';
import { useNetwork } from 'hooks';

export function NetworkStatus() {
  const { active, error } = useWeb3React();
  const network = useNetwork();

  return (
    <div className="flex self-end h-10 justify-center items-start m-3">
      {network && <span className="mr-3 text-slate-400">{network?.name}</span>}
      <span>Status: {active ? '🟢' : error ? '🔴' : '🟠'}</span>
    </div>
  );
}
