

import albedo from "@albedo-link/intent";

// Connect Freighter
export async function connectFreighter() {
  if (!window.freighterAPI) {
    throw {
      type: "WALLET_NOT_FOUND",
      message: "Install Freighter extension first",
    };
  }

  const address = await window.freighterAPI.getPublicKey();

  return {
    address,
    wallet: "freighter",
  };
}

// Connect Albedo
export async function connectAlbedo() {
  const result = await albedo.publicKey({
    token: "Connect to Stellar Swap App",
  });

  return {
    address: result.pubkey,
    wallet: "albedo",
  };
}

// ✅ REQUIRED: transaction signing function
export async function signTransaction(xdr, walletType) {

  if (walletType === "freighter") {

    if (!window.freighterAPI) {
      throw new Error("Freighter extension not installed");
    }

    return await window.freighterAPI.signTransaction(xdr, {
      network: "TESTNET",
    });
  }

  if (walletType === "albedo") {

    const result = await albedo.tx({
      xdr,
      network: "testnet",
    });

    return result.signed_envelope_xdr;
  }

  throw new Error("Unsupported wallet type");
}