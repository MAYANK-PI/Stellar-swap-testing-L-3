// src/components/TxStatus.jsx
const STATUS_COLORS = {
  idle:     "#6b7280",
  pending:  "#d97706",
  polling:  "#2563eb",
  SUCCESS:  "#16a34a",
  FAILED:   "#dc2626",
  TIMEOUT:  "#9333ea",
  error:    "#dc2626",
};

export default function TxStatus({ txState }) {
  if (txState.status === "idle") return null;
  const color = STATUS_COLORS[txState.status] || "#333";
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 10,
      padding: "12px 16px", marginBottom: 16, background: `${color}08` }}>
      <div style={{ fontWeight: 500, color, fontSize: 14 }}>
        {{ idle:"–", pending:"Pending…", polling:"Confirming on-chain…",
           SUCCESS:"✓ Success", FAILED:"✗ Failed", TIMEOUT:"Timed out", error:"Error" }[txState.status]}
      </div>
      {txState.hash && (
        <a href={`https://stellar.expert/explorer/testnet/tx/${txState.hash}`}
          target="_blank" rel="noreferrer"
          style={{ fontSize: 12, fontFamily: "monospace", color: "#2563eb", wordBreak: "break-all" }}>
          {txState.hash}
        </a>
      )}
      {txState.error && (
        <div style={{ fontSize: 13, color: "#dc2626", marginTop: 4 }}>
          {txState.error.message || JSON.stringify(txState.error)}
        </div>
      )}
    </div>
  );
}