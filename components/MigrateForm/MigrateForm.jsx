import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Fraction } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

import {
  useLPPosition,
  useCurrentBlockTimestamp,
  useApprove,
  APPROVAL_STATE,
  useERC20Permit,
  useSushiRollContract,
  useAmountsToMigrate,
  useNetwork,
} from 'hooks';
import { isPercentage, calculateGasMargin } from 'utils';
import {
  DEFAULT_SLIPPAGE_TOLERANCE,
  DEFAULT_SIGNIFICANT_DIGITS_UI,
  DEFAULT_DEADLINE,
  SUSHI_ROLL_ADDRESS,
} from 'config';
import { useCopiedTokensData } from 'context';

export function MigrateForm({ withPermit }) {
  const [migrationInProgress, setMigrationInProgress] = useState();
  const router = useRouter();
  const { library } = useWeb3React();
  const network = useNetwork();
  const { token0, token1 } = useCopiedTokensData();
  const [userPoolBalance, token0Deposited, token1Deposited] = useLPPosition(
    token0,
    token1
  );
  const [percentageAmount, setPercentageAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const block = useCurrentBlockTimestamp();

  const sushiRoll = useSushiRollContract();
  const [lpTokenAmount, token0Amount, token1Amount] =
    useAmountsToMigrate(percentageAmount);

  const [approval, approveCallback] = useApprove(
    lpTokenAmount,
    sushiRoll?.address
  );

  const { gatherPermitSignature, signatureData } = useERC20Permit(
    lpTokenAmount,
    sushiRoll?.address,
    {
      name: 'Uniswap V2',
      verifyingContract: SUSHI_ROLL_ADDRESS[network?.chainId],
      version: '1',
    }
  );

  useEffect(() => {
    if (userPoolBalance?.quotient) {
      if (JSBI.equal(userPoolBalance?.quotient, JSBI.BigInt(0))) {
        setInputError('Insufficient balance');
      }
    }
  }, [userPoolBalance?.quotient]);

  const handleMaxClick = () => {
    setPercentageAmount('100');
    setInputError('');
  };

  const handleApprove = async () => {
    if (!library) {
      console.error('[handleApprove] missing library or pair');
    }
    if (!lpTokenAmount) {
      console.error('[handleApprove] missing lpTokenAmount');
    }

    if (withPermit) {
      await gatherPermitSignature();
    } else {
      await approveCallback();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (percentageAmount && isPercentage(percentageAmount)) {
      const deadline = block.add(DEFAULT_DEADLINE).toHexString();

      const slippageAmount0 = token0Amount
        .multiply(new Fraction(1, 1).subtract(DEFAULT_SLIPPAGE_TOLERANCE))
        .quotient?.toString();
      const slippageAmount1 = token1Amount
        .multiply(new Fraction(1, 1).subtract(DEFAULT_SLIPPAGE_TOLERANCE))
        .quotient?.toString();

      const lpTokenFormatted = lpTokenAmount.quotient.toString();

      if (sushiRoll) {
        const args = [
          token0Amount?.currency.address,
          token1Amount?.currency.address,
          lpTokenFormatted,
          slippageAmount0,
          slippageAmount1,
          signatureData?.deadline ? signatureData.deadline : deadline,
          ...(signatureData ? [signatureData.v] : []),
          ...(signatureData ? [signatureData.r] : []),
          ...(signatureData ? [signatureData.s] : []),
        ];
        const method = withPermit ? 'migrateWithPermit' : 'migrate';
        const safeGasEstimates = await sushiRoll.estimateGas[method](...args)
          .then((estimateGas) => calculateGasMargin(estimateGas))
          .catch((error) => {
            console.error(
              `[sushiRoll.estimateGas] for method ${method} failed`,
              args,
              error
            );
            return undefined;
          });

        if (safeGasEstimates) {
          sushiRoll[method](...args, {
            gasLimit: safeGasEstimates,
          })
            .then(async (tx) => {
              setMigrationInProgress(true);
              const receipt = await tx.wait();
              if (receipt) {
                if (typeof window !== 'undefined') {
                  router.reload(window.location.pathname);
                }
              }
            })
            .catch((error) => {
              console.error(`[sushiRoll.${method}] failed`, args, error);
            });
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const {
      target: { value },
    } = e;
    const withoutLastCharacter = value.slice(0, -1);
    if (
      value.length === 0 ||
      isPercentage(value) ||
      (value.charAt(value.length - 1) === '.' &&
        isPercentage(withoutLastCharacter))
    ) {
      setInputError('');
      setPercentageAmount(value);
    } else if (isPercentage(withoutLastCharacter)) {
      setPercentageAmount(withoutLastCharacter);
      setInputError('');
    } else if (value?.length > 0) {
      setPercentageAmount(value);
      setInputError('Enter a valid percentage');
    }
  };

  const handleInputBlur = () => {
    if (percentageAmount?.length > 0 && !isPercentage(percentageAmount)) {
      setInputError('Enter a valid percentage');
    }
  };

  let wasApproved = false;
  if (withPermit) {
    if (signatureData !== null) {
      wasApproved = true;
    }
  } else {
    if (approval === APPROVAL_STATE.APPROVED) {
      wasApproved = true;
    }
  }

  return (
    <form
      className="flex flex-col items-start w-8/12 bg-slate-800 rounded-lg p-3"
      onSubmit={handleSubmit}
    >
      {token0Deposited && token1Deposited && (
        <span className="mb-3 text-xl">
          {token0Deposited.currency.symbol}/{token1Deposited.currency.symbol}
        </span>
      )}
      <label htmlFor="percentageAmount" className="mb-3">
        Amount of tokens
      </label>
      <div className="flex items-start self-stretch justify-between">
        <div className="flex items-center mr-3">
          <input
            type="text"
            name="percentageAmount"
            id="percentageAmount"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            value={percentageAmount}
            placeholder="0.00"
            className={`focus:ring-sky-700 focus:border-sky-700 block w-full pl-7 pr-12 bg-slate-600 rounded-md h-10 placeholder-slate-400 ${
              inputError ? 'border-red-400' : 'border-slate-600'
            }`}
          />
          <span className="relative right-10">%</span>
        </div>
        <button
          type="button"
          onClick={handleMaxClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-200 disabled:text-gray-500"
        >
          Max
        </button>
      </div>
      {inputError && <span className="text-red-400 mt-1">{inputError}</span>}
      <div className="flex items-start mb-3 self-stretch justify-between mt-3">
        <div className="flex flex-col">
          <span className="mb-1">
            Will be migrated:{' '}
            {lpTokenAmount?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
          </span>
          <span className="mb-1">
            {token0Deposited?.currency.symbol}:{' '}
            {token0Amount?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
          </span>
          <span className="mb-1">
            {token1Deposited?.currency.symbol}:{' '}
            {token1Amount?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
          </span>
        </div>
        <span>
          Balance:{' '}
          {userPoolBalance?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
        </span>
      </div>
      <div className="flex">
        <button
          type="button"
          onClick={handleApprove}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-200 disabled:text-gray-500 mr-3"
          disabled={
            inputError?.length === 0 && withPermit
              ? signatureData !== null
              : approval !== APPROVAL_STATE.NOT_APPROVED
          }
        >
          {approval === APPROVAL_STATE.PENDING
            ? 'Approving...'
            : `Approve${wasApproved ? 'd' : ''} ${
                withPermit ? 'with signature' : ''
              }`}
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-200 disabled:text-gray-500"
          disabled={
            migrationInProgress ||
            (inputError?.length === 0 && withPermit
              ? signatureData === null
              : approval !== APPROVAL_STATE.APPROVED)
          }
        >
          {`${migrationInProgress ? 'Migrating...' : 'Migrate'}`}
        </button>
      </div>
    </form>
  );
}
