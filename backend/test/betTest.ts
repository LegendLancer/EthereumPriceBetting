import { generateArgs } from '../params';
import { expect, use } from "chai";
import { solidity } from 'ethereum-waffle';
import { network, ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import axios from "axios";

use(solidity);

const formatEther = (bn: any) => {
  return parseFloat(ethers.utils.formatEther(bn));
}

const formatPrice = (bn: any) => {
  return parseFloat(ethers.utils.formatUnits(bn, '8'));
}

const mockArgs = {
  "betters": [
    "0x23507516EC572688d97132Ced7C13952a58Bd889",
    "0xFBfFafc3C61566cec082c9A2884543d9de35B009"
  ],
  "betEndDate": new Date("2022-04-01 10:32:00"),
  "betAmounts": [0.01, 0.02],
  "betPositions": [0, 1],
  "pivotPrice": 3000
}

describe("Betting on Ethereum Price", () => {
  let betting: Contract;
  let deployer:any;
  let better1:any, better2:any;
  let hacker:any;

  const deploy = async (args: any = mockArgs) => {
    const PriceBet = await ethers.getContractFactory("PriceBet");
    betting = await upgrades.deployProxy(PriceBet, generateArgs(args));
    await betting.deployed();
  }

  const sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  beforeEach(async () => {
    [deployer, better1, better2, hacker] = await ethers.getSigners();
  });

  it("1. Get Ethereum Price From Oracle", async () => {
    await deploy();
    const currentETHPrice = formatPrice(await betting.getEthereumPrice()); 
    console.log(`Price from Oracle: ${currentETHPrice.toFixed(2)} USD/ETH`);
    let data:any = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum");
    let currentPrice = data.data[0].current_price;
    console.log(`Price from Coingecko API: `, currentPrice);
    expect(currentPrice - currentETHPrice).to.be.lte(5);
  });

  it("2. Only 2 betters are available to deposit", async () => {
    // deploy with new args
    let newArgs = mockArgs;
    newArgs.betters = [better1.address, better2.address];
    await deploy();

    // get bet info
    const betInfo1 = await betting.getBetInfo(better1.address);
    const betInfo2 = await betting.getBetInfo(better2.address);

    // hacker tries to deposit & fails
    await expect(betting.connect(hacker).deposit({value: betInfo1.reserveAmount})).to.be.revertedWith("NOT_AN_ALLOWED_BETTER");

    // successfully deposit
    await betting.connect(better1).deposit({value: betInfo1.reserveAmount});
    await betting.connect(better2).deposit({value: betInfo2.reserveAmount});
  });

  it("3. Total test - deploy, get bet info, deposit, execute, withdraw", async () => {
    // deploy
    let newArgs = mockArgs;
    newArgs.betters = [better1.address, better2.address];
    let endDate = new Date();
    endDate.setSeconds(endDate.getSeconds() + 20);
    newArgs.betEndDate = endDate;
    await deploy(newArgs);

    // get bet infos
    const betInfo1 = await betting.getBetInfo(better1.address);
    const betInfo2 = await betting.getBetInfo(better2.address);

    // deposit & status == NOT_INITATED
    expect(await betting.betStatus()).to.equal(0);
    await betting.connect(better1).deposit({value: betInfo1.reserveAmount});
    await betting.connect(better2).deposit({value: betInfo2.reserveAmount});

    // status == ONGOING & CANNOT_EXECUTE
    expect(await betting.betStatus()).to.equal(1);
    await expect(betting.connect(deployer).execute()).to.be.reverted;

    // try to execute the bet before ending time
    await expect(betting.connect(deployer).execute()).to.be.reverted;

    // try to withdraw before end
    await expect(betting.connect(better1).withdraw()).to.be.reverted;
    await expect(betting.connect(better2).withdraw()).to.be.reverted;

    // mine next block to the end time
    await network.provider.send("evm_setNextBlockTimestamp", 
        [parseInt(ethers.utils.formatUnits(await betting.endTimestamp(), '0'))]);
    await network.provider.send("evm_mine");

    // execute the bet
    await expect(betting.connect(better1).execute()).to.be.reverted;
    await betting.connect(deployer).execute();

    // betting status finish
    expect(await betting.betStatus()).to.equal(2);

    // withdraw
    const currentPrice = formatPrice(await betting.getEthereumPrice());
    const expectedReward = newArgs.betAmounts[0] + newArgs.betAmounts[1];
    if(currentPrice > newArgs.pivotPrice){
      // so better1 wins
      const prevBalance = formatEther(await ethers.provider.getBalance(better1.address));
      await betting.connect(better1).withdraw();
      const afterBalance = formatEther(await ethers.provider.getBalance(better1.address));

      expect(afterBalance - prevBalance - expectedReward).to.be.lte(0.001);
    } else if(currentPrice < newArgs.pivotPrice) {
      // so better2 wins
      const prevBalance = formatEther(await ethers.provider.getBalance(better2.address));
      await betting.connect(better2).withdraw();
      const afterBalance = formatEther(await ethers.provider.getBalance(better2.address));
      
      expect(afterBalance - prevBalance - expectedReward).to.be.lte(0.001);
    } else {
      await betting.connect(better1).withdraw();
      await betting.connect(better2).withdraw();
    }
  });
});
