import { useEffect, useState } from "react";
import { buildSwapTx, submitTx, pollTxStatus } from "../contractClient";
import { signTransaction } from "../WalletIntegration";
import { loadCache, saveCache } from "../utilis/cache";

export default function SwapForm({ wallet, setTxState }) {
  const [amountIn, setAmountIn] = useState("");
  const [minOut, setMinOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // =========================
  // RESTORE CACHE
  // =========================
  useEffect(() => {
    const cache = loadCache();
    if (cache) {
      setAmountIn(cache.amountIn || "");
      setMinOut(cache.minOut || "");

      if (cache.txHistory) {
        setTxState(cache.txHistory);
      }
    }
  }, [setTxState]);

  // =========================
  // SAVE INPUT CACHE
  // =========================
  useEffect(() => {
    const cache = loadCache() || {};

    saveCache({
      ...cache,
      amountIn,
      minOut,
    });
  }, [amountIn, minOut]);

  // =========================
  // TX HISTORY HANDLER
  // =========================
  function pushTx(update) {
    setTxState((prev) => {
      const updated = [update, ...(prev || [])];

      const cache = loadCache() || {};
      saveCache({
        ...cache,
        txHistory: updated,
        amountIn,
        minOut,
      });

      return updated;
    });
  }

  // =========================
  // HANDLE SWAP
  // =========================
  async function handleSwap() {
    if (!wallet) {
      pushTx({
        status: "Failed ❌",
        hash: null,
        error: "Wallet not connected",
        time: new Date().toLocaleTimeString(),
      });
      return;
    }

    setLoading(true);
    setStatus("Waiting for wallet approval…");

    try {
      // 1️⃣ Pending state
      pushTx({
        status: "Pending ⏳",
        hash: null,
        error: null,
        time: new Date().toLocaleTimeString(),
      });

      // 2️⃣ Build transaction
      const tx = await buildSwapTx(
        wallet.address,
        parseFloat(amountIn),
        parseFloat(minOut)
      );

      // 3️⃣ Sign transaction
      setStatus("Please approve the transaction in your wallet…");

      const signedXdr = await signTransaction(
        tx.toXDR(),
        wallet.wallet
      );

      // 4️⃣ Submit transaction
      setStatus("Submitting transaction to Stellar network…");

      const hash = await submitTx(signedXdr);

      pushTx({
        status: "Pending ⏳",
        hash,
        error: null,
        time: new Date().toLocaleTimeString(),
      });

      // 5️⃣ Poll transaction status
      setStatus("Waiting for on-chain confirmation…");

      const finalStatus = await pollTxStatus(hash);

      if (finalStatus === "SUCCESS") {
        setStatus("Swap successful ✅");

        pushTx({
          status: "Success ✅",
          hash,
          error: null,
          time: new Date().toLocaleTimeString(),
        });
      } else if (finalStatus === "FAILED") {
        setStatus("Transaction failed on-chain ❌");

        pushTx({
          status: "Failed ❌",
          hash,
          error: "Transaction failed on-chain",
          time: new Date().toLocaleTimeString(),
        });
      } else {
        setStatus("Transaction confirmation timeout ⏱️");

        pushTx({
          status: "Timeout ⏱️",
          hash,
          error: "Transaction confirmation timeout",
          time: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      let message = err?.message || "Transaction error";

      if (message.toLowerCase().includes("rejected")) {
        message = "Transaction rejected by wallet";
      }

      if (message.toLowerCase().includes("cancel")) {
        message = "Transaction cancelled by user";
      }

      setStatus("Transaction cancelled or failed ❌");

      pushTx({
        status: "Failed ❌",
        hash: null,
        error: message,
        time: new Date().toLocaleTimeString(),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={box}>
      <p style={{ fontSize: 14, marginBottom: 12 }}>
        Swap XLM → Token
      </p>

      <input
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        placeholder="Amount in (XLM)"
        type="number"
        style={input}
      />

      <input
        value={minOut}
        onChange={(e) => setMinOut(e.target.value)}
        placeholder="Min amount out"
        type="number"
        style={{ ...input, marginTop: 8 }}
      />

      {status && <div style={statusBox}>{status}</div>}

      <button
        onClick={handleSwap}
        disabled={loading || !amountIn || !minOut}
        style={button}
      >
        {loading ? "Swapping…" : "Swap"}
      </button>
    </div>
  );
}

// =========================
// STYLES
// =========================

const box = {
  background: "#f9f9f9",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
};

const input = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};

const statusBox = {
  marginTop: 10,
  padding: 8,
  background: "#eef2ff",
  borderRadius: 8,
  fontSize: 13,
};

const button = {
  marginTop: 12,
  padding: "10px 24px",
  background: "#6d28d9",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  width: "100%",
};