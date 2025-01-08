// scripts/deployAndImpersonate.ts
import { ethers, network } from "hardhat";
import "../artifacts/contracts/DaiV2.sol/DaiV2.json";
import { Address } from "hardhat-deploy/dist/types";
async function main() {
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const IMPERSONATED_ADDRESS = "0xf1dA173228fcf015F43f3eA15aBBB51f0d8f1123";

  // Get the original DAI contract
  const Dai = await ethers.getContractFactory("Dai");
  const DaiV2 = await ethers.getContractFactory("DaiV2");

  // Deploy DaiV2 implementation
  //   const daiV2 = await DaiV2.deploy(1); // chainId = 1
  //   const daiV2Address = await daiV2.getAddress();
  //   console.log("DaiV2 deployed to:", daiV2Address);

  const status = await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [IMPERSONATED_ADDRESS],
  });

  console.log("====================================");
  console.log("impersonate status  : ", status);
  console.log("====================================");
  // Get a signer for the impersonated account
  //   const impersonatedSigner = await ethers.getSigner(IMPERSONATED_ADDRESS);
  const signer = await ethers.getSigner(IMPERSONATED_ADDRESS);
  console.log(network);
  // Get the DAI contract with the impersonated signer
  let daiContract = await ethers.getContractAt("Dai", DAI_ADDRESS, signer);

  const daiV2ByteCode = DaiV2.bytecode;
  await network.provider.send("hardhat_setCode", [DAI_ADDRESS, daiV2ByteCode]);
  // daiContract = await ethers.getContractAt("DaiV2", DAI_ADDRESS, signer);
  // Impersonate the account

  // Execute the transfer
  const tx = await daiContract.transferFrom(
    IMPERSONATED_ADDRESS,
    DAI_ADDRESS,
    "1"
  );

  let receipt = await tx.wait();

  console.log(receipt);

  const events = receipt?.logs.filter(
    (log) =>
      daiContract.interface.parseLog(log)?.fragment.name ==
      "BuildBearDAIV2Event"
  );

  console.log("Events emitted:", events);

  // Stop impersonating
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [IMPERSONATED_ADDRESS],
  });
  console.log(await daiContract.connect(signer).totalSupply());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
