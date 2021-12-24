import { useState } from 'react';
import { useTimeoutWhen } from 'rooks';
import { ClipboardCopyIcon } from '@heroicons/react/solid';

import { useCopiedTokensData } from '../../context';

export function CopyButton({ tokenAddress }) {
  const { handleCopyToken } = useCopiedTokensData();
  const [isCopied, setIsCopied] = useState(false);
  useTimeoutWhen(() => setIsCopied(false), 1000, isCopied);

  const handleCopyClick = () => {
    setIsCopied(true);
    handleCopyToken(tokenAddress);
  };

  return (
    <>
      {isCopied && (
        <span className="flex items-center mr-3 text-slate-400">
          token address copied
        </span>
      )}
      <button
        title="copy token address"
        className="flex self-center items-center justify-center h-10 w-10 border-solid border-2 border-slate-400 rounded-md"
        onClick={handleCopyClick}
      >
        <ClipboardCopyIcon className="h-5 w-5" />
      </button>
    </>
  );
}
