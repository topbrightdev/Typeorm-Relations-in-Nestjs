import { useState, useCallback, useMemo } from 'react';
import { usePreviousDifferent } from 'rooks';
import { useWeb3React } from '@web3-react/core';
import { MaxUint256 } from '@ethersproject/constants';

import { calculateGasMargin } from 'utils';
import { useTokenAllowance } from './useTokenAllowance';
import { useTokenContract } from './useContract';

export const APPROVAL_STATE = {
  UNKNOWN: 'UNKNOWN',
  NOT_APPROVED: 'NOT_APPROVED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
};

export function useApprove(amountToApprove, spender) {
  const [isPending, setIsPending] = useState(false);
  const previousIsPending = usePreviousDifferent(isPending);
  const { account, chainId } = useWeb3React();
  const token = amountToApprove?.currency?.isToken
    ? amountToApprove.currency
    : undefined;
  const currentAllowance = useTokenAllowance(
    token,
    account,
    spender,
    previousIsPending && previousIsPending !== isPending
  );

  const approvalState = useMemo(() => {
    if (!amountToApprove || !spender) return APPROVAL_STATE.UNKNOWN;
    if (amountToApprove.currency.isNative) return APPROVAL_STATE.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return APPROVAL_STATE.UNKNOWN;

    if (currentAllowance.lessThan(amountToApprove)) {
      if (isPending) {
        return APPROVAL_STATE.PENDING;
      } else {
        return APPROVAL_STATE.NOT_APPROVED;
      }
    } else {
      return APPROVAL_STATE.APPROVED;
    }
  }, [amountToApprove, currentAllowance, spender, isPending]);

  const tokenContract = useTokenContract(token?.address);

  const approve = useCallback(async () => {
    if (approvalState !== APPROVAL_STATE.NOT_APPROVED) {
      console.error('[useApprove] approve was called unnecessarily');
      return;
    }
    if (!chainId) {
      console.error('[useApprove] chainId is missing');
      return;
    }
    if (!token) {
      console.error('[useApprove] token is missing');
      return;
    }
    if (!tokenContract) {
      console.error('[useApprove] tokenContract is missing');
      return;
    }
    if (!amountToApprove) {
      console.error('[useApprove] amountToApprove is missing');
      return;
    }
    if (!spender) {
      console.error(`[useApprove] spender is missing`);
      return;
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.quotient.toString()
        );
      });

    return tokenContract
      .approve(
        spender,
        useExact ? amountToApprove.quotient.toString() : MaxUint256,
        {
          gasLimit: calculateGasMargin(estimatedGas),
        }
      )
      .then(async (tx) => {
        setIsPending(true);
        const receipt = await tx.wait();
        if (receipt) {
          setIsPending(false);
        }
      })
      .catch((error) => {
        console.error('[tokenContract.approve] failed to approve token', error);
        throw error;
      });
  }, [approvalState, token, tokenContract, amountToApprove, spender, chainId]);

  return [approvalState, approve];
}
