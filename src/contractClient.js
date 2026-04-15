// src/contractClient.js

import {
  rpc as SorobanRpc,
  Horizon,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Contract,
  nativeToScVal,
} from "@stellar/stellar-sdk";

// Soroban RPC server
const SERVER = new SorobanRpc.Server(
  "https://soroban-testnet.stellar.org"
);

// Horizon server
const HORIZON = new Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

// Replace after deployment
export const CONTRACT_ID = "CDR24SX4QHNHQXD7XECHLXWBGQVAYXV4KRKZO5Q4M24DGNLLPBYP7YQ3";

// Get XLM balance
export async function getXLMBalance(address) {
  try {
    const account = await HORIZON.loadAccount(address);

    const xlm = account.balances.find(
      (b) => b.asset_type === "native"
    );

    return parseFloat(xlm?.balance || "0");
  } catch {
    return 0;
  }
}

// Build swap transaction
export async function buildSwapTx(sourceAddress, amountIn, minAmountOut) {
  const account = await SERVER.getAccount(sourceAddress);

  const balance = await getXLMBalance(sourceAddress);

  if (balance < amountIn + 1) {
    throw {
      type: "INSUFFICIENT_BALANCE",
      message: `Need ${amountIn + 1} XLM but only have ${balance.toFixed(2)} XLM.`,
    };
  }

  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "swap",
        nativeToScVal(amountIn * 1e7, { type: "i128" }),
        nativeToScVal(minAmountOut * 1e7, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build();

  const simResult = await SERVER.simulateTransaction(tx);

  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw {
      type: "SIMULATION_FAILED",
      message: simResult.error,
    };
  }

  return SorobanRpc.assembleTransaction(tx, simResult).build();
}

// Submit transaction
export async function submitTx(signedXdr) {
  const tx = TransactionBuilder.fromXDR(
    signedXdr,
    Networks.TESTNET
  );

  const result = await SERVER.sendTransaction(tx);

  return result.hash;
}

// Poll transaction status
export async function pollTxStatus(hash) {
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));

    const result = await SERVER.getTransaction(hash);

    if (result.status === "SUCCESS") return "SUCCESS";
    if (result.status === "FAILED") return "FAILED";
  }

  return "TIMEOUT";
}