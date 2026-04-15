export default function EventLog({ events }) {
  if (!events.length) return null;

  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
        Live Contract Events
      </p>

      {events.map((e) => (
        <div
          key={e.id}
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            borderBottom: "1px solid #f0f0f0",
            padding: "6px 0",
            display: "flex",
            gap: 12,
          }}
        >
          <span style={{ color: "#6d28d9" }}>{e.time}</span>
          <span style={{ color: "#059669" }}>{e.type}</span>
          <span style={{ color: "#6b7280", wordBreak: "break-all" }}>
            {e.data}
          </span>
        </div>
      ))}
    </div>
  );
}