# Ganstrat

## Environment Variables

Set the following variables in your shell before running Hardhat tasks:

- `RPC_URL`: RPC endpoint for the target network.
- `PRIVATE_KEY`: Private key for deploying and verifying contracts.
- `ETHERSCAN_API_KEY`: API key used by the Etherscan plugin.

## Verifying Contracts

Use Hardhat to verify a deployed contract:

```
npx hardhat verify <DEPLOYED_ADDRESS> --network <NETWORK_NAME>
```
