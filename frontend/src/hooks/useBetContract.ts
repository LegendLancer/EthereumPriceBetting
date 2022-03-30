import {ethers} from 'ethers';
import {useContractCall, useContractFunction} from '@usedapp/core';
import {formatUnits} from '@ethersproject/units';
import {Contract} from '@ethersproject/contracts';
import contractABI from '../abi/index.json';
import {betContractAddress} from '../contract';

const betContractInterface = new ethers.utils.Interface(contractABI);
const betContract = new Contract(
  betContractAddress,
  betContractInterface
)

export const useEthereumPrice = () => {
  const [etherPrice] = useContractCall(
    {
      abi: betContractInterface,
      address: betContractAddress,
      method: 'getEthereumPrice',
      args: []
    }
  ) ?? [];

  return etherPrice && parseFloat(formatUnits(etherPrice, '8'));
}

export const usePivotPrice = () => {
  const [pivotPrice] = useContractCall(
    {
      abi: betContractInterface,
      address: betContractAddress,
      method: 'pivotPrice',
      args: []
    }
  ) ?? [];

  return pivotPrice && parseFloat(formatUnits(pivotPrice, '8'));
}

export const useEndTime = () => {
  const [endTime] = useContractCall(
    {
      abi: betContractInterface,
      address: betContractAddress,
      method: 'endTimestamp',
      args: []
    }
  ) ?? [];

  return endTime;
}

export const useBetStatus = () => {
  const [betStatus] = useContractCall(
    {
      abi: betContractInterface,
      address: betContractAddress,
      method: 'betStatus',
      args: []
    }
  ) ?? [];

  return betStatus;
}


export const useGetBetInfo = (address:string | null | undefined) => {
  const [betInfo] = useContractCall(
    {
      abi: betContractInterface,
      address: betContractAddress,
      method: 'getBetInfo',
      args: [address]
    }
  ) ?? [];

  return betInfo;
}

export const useDeposit = () => {
  const {state, send, events} = useContractFunction(betContract, 'deposit', {});
  return {state, send, events};
}

export const useExecute = () => {
  const {state, send, events} = useContractFunction(betContract, 'execute', {});
  return {state, send, events};
}

export const useWithdraw = () => {
  const {state, send, events} = useContractFunction(betContract, 'withdraw', {});
  return {state, send, events};
}