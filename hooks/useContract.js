import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import SushiRollABI from '@sushiswap/core/build/abi/SushiRoll.json';
import MulticallABI from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json';

import {
  UNISWAP_INTERFACE_MULTICALL_ADDRESS,
  SUSHI_ROLL_ADDRESS,
} from 'config';

import { useNetwork } from './useNetwork';

import ERC20_ABI from 'abis/erc20.json';
import EIP_2612 from 'abis/eip_2612.json';

const ERC20_INTERFACE = new Interface(ERC20_ABI);
const EIP2612_INTERFACE = new Interface(EIP_2612);
const V2PAIR_INTERFACE = new Interface(IUniswapV2PairABI.abi);
const SUSHI_ROLL_INTERFACE = new Interface(SushiRollABI);

export function useContract(address, ABI, withSigner = true) {
  const { library, account, chainId } = useWeb3React();
  const isValidAddress = ethers.utils.isAddress(address);

  return useMemo(() => {
    if (!address || !ABI || !library || !chainId || !isValidAddress)
      return null;
    try {
      const signer = library.getSigner(account).connectUnchecked();
      return new Contract(address, ABI, withSigner ? signer : library);
    } catch (error) {
      console.error('[useContract] error', error);
      return null;
    }
  }, [address, ABI, library, chainId, account, withSigner, isValidAddress]);
}

export function useTokenContract(tokenAddress, withSigner = true) {
  return useContract(tokenAddress, ERC20_INTERFACE, withSigner);
}

export function useEIP2612Contract(tokenAddress) {
  return useContract(tokenAddress, EIP2612_INTERFACE, false);
}

export function useMultiCallContract() {
  return useContract(UNISWAP_INTERFACE_MULTICALL_ADDRESS, MulticallABI.abi);
}

export function useV2pairContract(pairAddress) {
  return useContract(pairAddress, V2PAIR_INTERFACE);
}

export function useSushiRollContract() {
  const network = useNetwork();
  return useContract(
    SUSHI_ROLL_ADDRESS[network?.chainId],
    SUSHI_ROLL_INTERFACE
  );
}
