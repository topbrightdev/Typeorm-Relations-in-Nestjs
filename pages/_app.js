import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { NetworkStatus } from 'components/NetworkStatus';
import { CopiedTokensProvider, TokenListProvider } from 'context';
import { Tabs, Tab } from 'components/Tabs';
import { useConnector } from 'hooks';

import '../styles/globals.css';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const TABS = [
  {
    url: '/',
    label: 'Token List',
  },
  {
    url: '/position',
    label: 'LP Position',
  },
  {
    url: '/migrate',
    label: 'Migrate',
  },
  {
    url: '/migrate-with-permit',
    label: 'Migrate with permit',
  },
];

function App({ Component, pageProps }) {
  useConnector();

  return (
    <TokenListProvider>
      <CopiedTokensProvider>
        <div className="flex flex-col justify-stretch flex-1 p-3 h-full bg-white">
          <NetworkStatus />
          <div className="flex flex-col self-center items-center justify-start w-6/12 bg-slate-900 text-slate-400 rounded-2xl h-4/5">
            <Tabs>
              {TABS.map((tab, key) => (
                <Tab key={key} id={tab.label} url={tab.url}>
                  {tab.label}
                </Tab>
              ))}
            </Tabs>
            <main className="flex flex-col self-stretch flex-1 p-3">
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </CopiedTokensProvider>
    </TokenListProvider>
  );
}

function AppWithWeb3(props) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <App {...props} />
    </Web3ReactProvider>
  );
}

export default AppWithWeb3;
