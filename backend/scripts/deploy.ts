import { ethers, upgrades } from "hardhat";
import { args } from '../params';
import file from 'fs';

async function deploy() {
  const PriceBet = await ethers.getContractFactory("PriceBet");
  const betContract = await upgrades.deployProxy(PriceBet, args);
  await betContract.deployed();
  console.log("Proxy deployed to:", betContract.address);
  const proxy = {proxyAddress: betContract.address};
  file.writeFileSync('./proxy.json', JSON.stringify(proxy));
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
