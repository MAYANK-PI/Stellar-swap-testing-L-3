// src/components/WalletSelector.jsx

import { useState } from "react";
import {
  connectFreighter,
  connectAlbedo,
} from "../walletKit";

export default function WalletSelector({ wallet, onConnect }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFreighter() {
    setError(null);
    setLoading(true);

    try {
      const result = await connectFreighter();
      onConnect(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAlbedo() {
    setError(null);
    setLoading(true);

    try {
      const result = await connectAlbedo();
      onConnect(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (wallet) {
    return (
      <div style={card}>
        <strong>Connected via {wallet.wallet}</strong>
        <div style={address}>{wallet.address}</div>
      </div>
    );
  }

  return (
    <div style={card}>
      <h3>Connect Wallet</h3>

      <button onClick={handleFreighter} disabled={loading} style={btn}>
        Connect Freighter
      </button>

      <button onClick={handleAlbedo} disabled={loading} style={btn}>
        Connect Albedo
      </button>

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

const card = {
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 10,
  marginBottom: 20,
};

const btn = {
  marginRight: 10,
  padding: "8px 14px",
  cursor: "pointer",
};

const address = {
  fontFamily: "monospace",
  marginTop: 6,
};

const errorStyle = {
  color: "red",
  marginTop: 10,
};