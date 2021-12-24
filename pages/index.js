import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { XCircleIcon } from '@heroicons/react/solid';

import { useTokenListData } from 'context';
import { CopyButton } from 'components/CopyButton';
import { ImportToken } from 'components/ImportToken';

import 'react-virtualized/styles.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenData, setTokenData] = useState([]);
  const { data, tokenDataError } = useTokenListData();

  useEffect(() => {
    if (searchTerm.length > 0) {
      const searchTermLowerCase = searchTerm.toLowerCase();
      const filteredData = data?.filter(
        (token) =>
          token?.name.toLowerCase().includes(searchTermLowerCase) ||
          token?.symbol.toLowerCase().includes(searchTermLowerCase) ||
          token?.address.toLowerCase().includes(searchTermLowerCase)
      );
      setTokenData(filteredData);
    } else {
      setTokenData(data);
    }
  }, [data, searchTerm]);

  if (tokenDataError) return <div>Failed to load tokens</div>;
  if (!data) return <div>Loading...</div>;

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearInput = () => {
    setSearchTerm('');
  };

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    _isScrolling, // The List is currently being scrolled
    _isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div
        key={key}
        style={{ ...style }}
        className="flex border-b-2 border-slate-400 text-left pr-3"
      >
        <div className="flex flex-col flex-1">
          <div>
            <span>
              <strong>Name:</strong> {tokenData[index].name}
            </span>
          </div>
          <div>
            <span>
              <strong>Symbol:</strong> {tokenData[index].symbol}
            </span>
          </div>
          <div>
            <span>
              <strong>Address:</strong> {tokenData[index].address}
            </span>
          </div>
        </div>
        <CopyButton tokenAddress={tokenData[index].address} />
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Sushi Assignment -- Tokens List</title>
        <meta name="description" content="Sushi Assignment -- Tokens List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-xl text-center pb-3">Token List</h2>
      <div className="flex relative mb-3">
        <input
          type="text"
          placeholder="Search"
          className="focus:ring-sky-700 focus:border-sky-700 block w-full pl-7 pr-12 border-slate-600 bg-slate-600 rounded-md h-10 placeholder-slate-500"
          onChange={handleInputChange}
          value={searchTerm}
        />
        {searchTerm && (
          <button
            className="absolute right-0 inset-y-1/4 mr-3"
            onClick={handleClearInput}
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="flex flex-col flex-1 mb-3">
        {tokenData && (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={tokenData.length}
                rowHeight={75}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        )}
      </div>
      <ImportToken />
    </>
  );
}
