import { ethers, network } from "hardhat";

async function main() {
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const IMPERSONATED_ADDRESS = "0xf1dA173228fcf015F43f3eA15aBBB51f0d8f1123";

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [IMPERSONATED_ADDRESS],
  });

  // Deploy DaiV2 first to get the bytecode
  const DaiV2 = await ethers.getContractFactory("DaiV2");
  const daiV2 = await DaiV2.deploy(1);
  await daiV2.waitForDeployment();

  // Impersonate account

  // Get signer
  const signer = await ethers.getSigner(IMPERSONATED_ADDRESS);

  // Fund the impersonated account with some ETH for gas
  await network.provider.send("hardhat_setBalance", [
    IMPERSONATED_ADDRESS,
    "0x1000000000000000000", // 1 ETH
  ]);

  // Get the runtime bytecode (not the deployment bytecode)
  const daiV2RuntimeBytecode = await network.provider.send("eth_getCode", [
    await daiV2.getAddress(),
    "latest",
  ]);

  // Set the bytecode
  await network.provider.send("hardhat_setCode", [
    DAI_ADDRESS,
    daiV2RuntimeBytecode,
  ]);

  // Get the contract instance with the new bytecode
  const upgradedDai = await ethers.getContractAt("DaiV2", DAI_ADDRESS, signer);

  // Try to execute a transfer
  try {
    const tx = await upgradedDai.transfer(
      ethers.ZeroAddress,
      ethers.parseEther("1")
    );
    const receipt = await tx.wait();
    console.log("Transfer successful");
    console.log("Events:", receipt?.logs);
  } catch (error) {
    console.error("Transfer failed:", error);
  }

  // Stop impersonating
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [IMPERSONATED_ADDRESS],
  });

  console.log(await upgradedDai.connect(signer).totalSupply());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
