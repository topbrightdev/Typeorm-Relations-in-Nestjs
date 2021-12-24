import { useCopiedTokensData } from '../../context';

export function LastCopiedTokens() {
  const { token0, token1, token0Error, token1Error, setToken0, setToken1 } =
    useCopiedTokensData();

  const handleToken0Change = (e) => {
    setToken0(e.target.value);
  };

  const handleToken1Change = (e) => {
    setToken1(e.target.value);
  };

  return (
    <div className="flex flex-col p-3 rounded-md space-y-4 w-11/12 mb-3 bg-slate-800">
      <span className="text-xl">Last used tokens</span>
      <div className="flex flex-col items-stretch">
        <div className="flex items-center justify-between">
          <span className="mr-3">token0:</span>
          <input
            type="text"
            className={`focus:ring-sky-700 focus:border-sky-700 block w-full pl-7 pr-12 bg-slate-600 rounded-md h-10 placeholder-slate-400 max-w-lg ${
              token0Error ? ' border-red-400' : 'border-slate-600'
            }`}
            value={token0}
            onChange={handleToken0Change}
          />
        </div>
        {token0Error && (
          <span className="text-right text-red-400 mt-1">{token0Error}</span>
        )}
      </div>
      <div className="flex flex-col items-stretch">
        <div className="flex items-center justify-between">
          <span className="mr-3">token1:</span>
          <input
            type="text"
            className={`focus:ring-sky-700 focus:border-sky-700 block w-full pl-7 pr-12 bg-slate-600 rounded-md h-10 placeholder-slate-400 max-w-lg ${
              token1Error ? 'border-red-400' : 'border-slate-600'
            }`}
            value={token1}
            onChange={handleToken1Change}
          />
        </div>
        {token1Error && (
          <span className="text-right text-red-400 mt-1">{token1Error}</span>
        )}
      </div>
    </div>
  );
}
