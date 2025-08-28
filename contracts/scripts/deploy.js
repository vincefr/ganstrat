async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const GanStratLottery = await ethers.getContractFactory("GanStratLottery");
  const lottery = await GanStratLottery.deploy();

  await lottery.waitForDeployment();

  console.log("GanStratLottery deployed to:", await lottery.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });