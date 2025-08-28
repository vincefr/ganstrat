import "@nomicfoundation/hardhat-verify";

export default {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      url: process.env.RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
