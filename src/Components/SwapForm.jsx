import { useState } from "react";
import { buildSwapTx, submitTx, pollTxStatus } from "../contractClient";
import { signTransaction } from "../walletKit";

export default function SwapForm({ wallet, setTxState }) {

  const [amountIn, setAmountIn] = useState("");
  const [minOut, setMinOut] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSwap() {

    // ❌ Wallet not connected
    if (!wallet) {
      setTxState(prev => [
        {
          status: "Failed ❌",
          hash: null,
          error: "Wallet not connected",
          time: new Date().toLocaleTimeString(),
        },
        ...(prev || []),
      ]);
      return;
    }

    setLoading(true);

    try {

      // ⏳ Show pending immediately
      setTxState(prev => [
        {
          status: "Pending ⏳",
          hash: null,
          error: null,
          time: new Date().toLocaleTimeString(),
        },
        ...(prev || []),
      ]);


      // 1️⃣ Build transaction
      const tx = await buildSwapTx(
        wallet.address,
        parseFloat(amountIn),
        parseFloat(minOut)
      );


      // 2️⃣ Sign transaction
      const signedXdr = await signTransaction(
        tx.toXDR(),
        wallet.wallet
      );


      // 3️⃣ Submit transaction
      const hash = await submitTx(signedXdr);


      // ⏳ Update pending with hash
      setTxState(prev => [
        {
          status: "Pending ⏳",
          hash,
          error: null,
          time: new Date().toLocaleTimeString(),
        },
        ...(prev || []),
      ]);


      // 4️⃣ Poll transaction result
      const finalStatus = await pollTxStatus(hash);


      // ✅ SUCCESS
      if (finalStatus === "SUCCESS") {

        setTxState(prev => [
          {
            status: "Success ✅",
            hash,
            error: null,
            time: new Date().toLocaleTimeString(),
          },
          ...(prev || []),
        ]);

      }

      // ❌ FAILED
      else if (finalStatus === "FAILED") {

        setTxState(prev => [
          {
            status: "Failed ❌",
            hash,
            error: "Transaction failed on-chain",
            time: new Date().toLocaleTimeString(),
          },
          ...(prev || []),
        ]);

      }

      // ⏱️ TIMEOUT
      else {

        setTxState(prev => [
          {
            status: "Timeout ⏱️",
            hash,
            error: "Transaction confirmation timeout",
            time: new Date().toLocaleTimeString(),
          },
          ...(prev || []),
        ]);

      }

    }

    catch (err) {

      let message = err?.message || "Transaction error";

      // ❌ Wallet rejected signing
      if (message.toLowerCase().includes("rejected")) {
        message = "Transaction rejected by wallet";
      }

      if (message.toLowerCase().includes("cancel")) {
        message = "Transaction cancelled by user";
      }

      // ❌ Insufficient balance already handled by contract
      setTxState(prev => [
        {
          status: "Failed ❌",
          hash: null,
          error: message,
          time: new Date().toLocaleTimeString(),
        },
        ...(prev || []),
      ]);

    }

    finally {
      setLoading(false);
    }
  }


  return (
    <div
      style={{
        background: "#f9f9f9",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >

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

      <button
        onClick={handleSwap}
        disabled={loading || !amountIn || !minOut}
        style={{
          marginTop: 12,
          padding: "10px 24px",
          background: "#6d28d9",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          width: "100%",
        }}
      >
        {loading ? "Swapping…" : "Swap"}
      </button>

    </div>
  );
}


const input = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};