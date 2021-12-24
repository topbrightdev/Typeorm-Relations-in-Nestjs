import { useEffect, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { splitSignature } from '@ethersproject/bytes';
import JSBI from 'jsbi';

import { DEFAULT_DEADLINE } from 'config';
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp';
import { useEIP2612Contract } from './useContract';

const EIP712_DOMAIN_TYPE = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const EIP2612_TYPE = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];

export function useERC20Permit(currencyAmount, spender, permitInfo) {
  const { account, chainId, library } = useWeb3React();
  const block = useCurrentBlockTimestamp();
  const transactionDeadline = block?.add(DEFAULT_DEADLINE);
  const tokenAddress = currencyAmount?.currency?.isToken
    ? currencyAmount.currency.address
    : undefined;
  const eip2612Contract = useEIP2612Contract(tokenAddress);
  const [tokenNonce, setTokenNonce] = useState(null);

  useEffect(() => {
    const getNonces = async () => {
      const nonce = await eip2612Contract.nonces(account);
      setTokenNonce(nonce);
    };
    if (eip2612Contract) {
      getNonces();
    }
  }, [eip2612Contract, account]);

  const [signatureData, setSignatureData] = useState(null);

  return useMemo(() => {
    if (
      !currencyAmount ||
      !eip2612Contract ||
      !account ||
      !chainId ||
      !transactionDeadline ||
      !library ||
      !tokenNonce ||
      !tokenAddress ||
      !spender ||
      !permitInfo
    ) {
      return {
        signatureData: null,
        gatherPermitSignature: null,
      };
    }

    const nonceNumber = tokenNonce?.toNumber();
    if (typeof nonceNumber !== 'number') {
      return {
        signatureData: null,
        gatherPermitSignature: null,
      };
    }

    const isSignatureDataValid =
      signatureData &&
      signatureData.owner === account &&
      signatureData.deadline >= transactionDeadline.toNumber() &&
      signatureData.tokenAddress === tokenAddress &&
      signatureData.nonce === nonceNumber &&
      signatureData.spender === spender &&
      ('allowed' in signatureData ||
        JSBI.equal(JSBI.BigInt(signatureData.amount), currencyAmount.quotient));

    return {
      signatureData: isSignatureDataValid ? signatureData : null,
      gatherPermitSignature: async function gatherPermitSignature() {
        const signatureDeadline =
          transactionDeadline.toNumber() + DEFAULT_DEADLINE;
        const value = currencyAmount.quotient.toString();

        const message = {
          owner: account,
          spender,
          value,
          nonce: nonceNumber,
          deadline: signatureDeadline,
        };
        const domain = {
          version: permitInfo.version,
          name: permitInfo.name,
          verifyingContract: tokenAddress,
          chainId,
        };
        const data = {
          types: {
            EIP712Domain: EIP712_DOMAIN_TYPE,
            Permit: EIP2612_TYPE,
          },
          domain,
          message,
          primaryType: 'Permit',
        };
        const dataFormatted = JSON.stringify(data);

        return library
          .send('eth_signTypedData_v4', [account, dataFormatted])
          .then(splitSignature)
          .then((signature) => {
            setSignatureData({
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: signatureDeadline,
              amount: value,
              nonce: nonceNumber,
              chainId,
              owner: account,
              spender,
              tokenAddress,
            });
          });
      },
    };
  }, [
    currencyAmount,
    eip2612Contract,
    account,
    chainId,
    transactionDeadline,
    library,
    tokenNonce,
    tokenAddress,
    spender,
    permitInfo,
    signatureData,
  ]);
}
