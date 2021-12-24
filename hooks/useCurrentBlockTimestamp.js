import { useEffect, useState } from 'react';
import { useMultiCallContract } from './useContract';

export function useCurrentBlockTimestamp() {
  const [block, setBlock] = useState(null);
  const multiCallContract = useMultiCallContract();

  useEffect(() => {
    const getCurrentTimeBlock = async () => {
      const currentBlock = await multiCallContract.getCurrentBlockTimestamp();
      setBlock(currentBlock);
    };
    if (multiCallContract) {
      getCurrentTimeBlock();
    }
  }, [multiCallContract]);

  return block;
}
