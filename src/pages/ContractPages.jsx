import { CONTRACT_ID } from "../contractClient";

export default function ContractPage() {
  return (
    <div>
      <h1 className="page-title">Contract Info</h1>

      <p>
        <strong>Contract ID:</strong>
      </p>

      <p style={{ wordBreak: "break-all" }}>
        {CONTRACT_ID}
      </p>

      <p style={{ marginTop: 10 }}>
        <strong>Network:</strong> Stellar Testnet
      </p>
    </div>
  );
}