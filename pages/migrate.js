import Head from 'next/head';

import { LastCopiedTokens } from 'components/LastCopiedTokens';
import { MigrateForm } from 'components/MigrateForm';

export default function Migrate() {
  return (
    <>
      <Head>
        <title>Sushi Assignment -- Migrate</title>
        <meta name="description" content="Sushi Assignment -- Migrate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-xl text-center pb-3">
        Migrate from Uniswap to SushiSwap
      </h2>
      <LastCopiedTokens />
      <MigrateForm />
    </>
  );
}
