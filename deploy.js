const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await wallet.connect(provider);
  const abi = fs.readFileSync(
    "./contracts/compiled/SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./contracts/compiled/SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  //   console.log("Deploying with only transaction data...");
  //   const nonce = await wallet.getTransactionCount();
  //   const chainId = await wallet.getChainId();
  //   const tx = {
  //     nonce: nonce,
  //     gasPrice: 20000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: "0x" + binary,
  //     chainId: chainId,
  //   };
  //   const txResponse = await wallet.sendTransaction(tx);
  //   await txResponse.wait(1);
  //   console.log(txResponse);
  let number = await contract.number();
  console.log(number.toString());
  await contract.incr_number();
  number = await contract.number();
  console.log(number.toString());
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
