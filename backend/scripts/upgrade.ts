const { ethers, upgrades } = require("hardhat");
const {proxyAddress} = require("../proxy.json");

async function upgrade() {
  const BetV2 = await ethers.getContractFactory("PriceBet");
  const NewContract = await upgrades.upgradeProxy(proxyAddress, BetV2);
  console.log("Contract upgraded");
}

upgrade().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
