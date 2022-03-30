import { ethers } from 'hardhat'
import {
  betters,
  betAmounts,
  betPositions,
  betEndDate,
  pivotPrice
} from './args.json'

const parseEther = (value: Number) => {
  return ethers.utils.parseEther(value.toString());
}

const parseUSD = (value: Number) => {
  return ethers.utils.parseUnits(value.toString(), '8');
}

export const args = [
  betters,
  [parseEther(betAmounts[0]), parseEther(betAmounts[1])],
  betPositions,
  new Date(betEndDate).getTime() / 1000,
  parseUSD(pivotPrice)
];

interface ArgsPropType {
  betters: any;
  betAmounts: any;
  betPositions: any;
  betEndDate: Date;
  pivotPrice: Number;
}

export const generateArgs = ({betters, betAmounts, betPositions, betEndDate, pivotPrice}: ArgsPropType) => {
  return [
    betters,
    [parseEther(betAmounts[0]), parseEther(betAmounts[1])],
    betPositions,
    (betEndDate.getTime() - betEndDate.getTime() % 1000) / 1000,
    parseUSD(pivotPrice)
  ]
}