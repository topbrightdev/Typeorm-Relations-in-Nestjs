import Head from 'next/head';

import { LastCopiedTokens } from 'components/LastCopiedTokens';
import { useLPPosition } from 'hooks';
import { useCopiedTokensData } from 'context';
import { DEFAULT_SIGNIFICANT_DIGITS_UI } from 'config';

export default function Position() {
  const { token0, token1 } = useCopiedTokensData();
  const [userPoolBalance, token0Deposited, token1Deposited] = useLPPosition(
    token0,
    token1
  );

  return (
    <>
      <Head>
        <title>Sushi Assignment -- LP Position</title>
        <meta name="description" content="Sushi Assignment -- LP Position" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-xl text-center pb-3">Uniswap LP Position</h2>
      <LastCopiedTokens />
      {token0Deposited && token1Deposited && userPoolBalance && (
        <div className="bg-slate-800 rounded-lg p-3 w-6/12">
          <span className="text-xl text-left pb-3">
            Your Position{' '}
            <span className="font-bold">
              {token0Deposited.currency.symbol}/
              {token1Deposited.currency.symbol}
            </span>
          </span>
          <div className="flex mb-3 justify-between mt-3">
            <span>Your total pool tokens:</span>
            <span>
              {userPoolBalance?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
            </span>
          </div>
          <div className="flex mb-3 justify-between">
            <span>Pooled {token0Deposited.currency.symbol}:</span>
            <span>
              {token0Deposited?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pooled {token1Deposited.currency.symbol}:</span>
            <span>
              {token1Deposited?.toSignificant(DEFAULT_SIGNIFICANT_DIGITS_UI)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
