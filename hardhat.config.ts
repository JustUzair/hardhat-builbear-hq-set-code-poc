// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-tracer";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: false,
        // runs: 200,
      },
    },
  },
  networks: {
    buildbear: {
      url: "https://rpc.buildbear.io/silky-bucky-e35bf6fc",
    },
    hardhat: {
      forking: {
        url: "https://rpc.buildbear.io/silky-bucky-e35bf6fc",
      },
    },
  },
};

export default config;
