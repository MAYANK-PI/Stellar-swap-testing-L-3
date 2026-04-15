export default function StatusPages({ txList }) {

  if (!txList || txList.length === 0) {
    return (
      <div>
        <h1 className="page-title">Transaction Status</h1>
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Transaction Status</h1>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
        }}
      >
        {txList.map((tx, index) => (

          <div
            key={index}
            style={{
              padding: "10px 0",
              borderBottom:
                index !== txList.length - 1
                  ? "1px solid #e5e7eb"
                  : "none",
            }}
          >

            {/* Time */}
            <span style={{ color: "#6b7280", marginRight: 12 }}>
              {tx.time}
            </span>

            {/* Status */}
            <strong
              style={{
                color:
                  tx.status === "Success ✅"
                    ? "green"
                    : tx.status === "Pending ⏳"
                    ? "orange"
                    : "red",
              }}
            >
              {tx.status}
            </strong>

            {/* Hash */}
            {tx.hash && (
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 4,
                  wordBreak: "break-all",
                }}
              >
                Hash: {tx.hash}
              </div>
            )}

            {/* Error */}
            {tx.error && (
              <div
                style={{
                  fontSize: 12,
                  color: "red",
                  marginTop: 4,
                }}
              >
                Error: {tx.error}
              </div>
            )}

          </div>

        ))}
      </div>
    </div>
  );
}