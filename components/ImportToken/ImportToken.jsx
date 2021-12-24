import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { useTokenListData } from 'context';
import { useToken } from 'hooks';

export function ImportToken() {
  const [address, setAddress] = useState('');
  const [inputError, setInputError] = useState('');
  const { addToken } = useTokenListData();
  const [token, tokenError] = useToken(address);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAddress = ethers.utils.isAddress(address);
    if (isAddress && token) {
      addToken(token);
      setAddress('');
      setInputError('');
    } else if (tokenError) {
      setInputError('Processing token failed');
    } else if (!isAddress) {
      setInputError('Address is not valid');
    }
  };

  useEffect(() => {
    const isAddress = ethers.utils.isAddress(address);
    if (isAddress || address?.length === 0) {
      setInputError('');
    }
  }, [address]);

  const handleInputChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
  };

  return (
    <>
      <form
        className="flex items-start self-stretch justify-between"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="percentageAmount"
          id="percentageAmount"
          onChange={handleInputChange}
          value={address}
          placeholder="Address"
          className={`focus:ring-sky-700 focus:border-sky-700 block w-full pl-7 pr-12 bg-slate-600 rounded-md h-10 placeholder-slate-400 mr-3 ${
            inputError ? 'border-red-400' : 'border-slate-600'
          }`}
        />
        <button
          disabled={inputError || address?.length === 0}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-200 disabled:text-gray-500"
        >
          Add
        </button>
      </form>
      {inputError && <span className="text-red-400 mt-1">{inputError}</span>}
    </>
  );
}
