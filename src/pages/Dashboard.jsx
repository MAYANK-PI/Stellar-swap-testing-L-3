import WalletSelector from "../components/WalletSelector";

export default function Dashboard({ wallet, setWallet }) {
  return (
    <div>
      <h1 className="page-title">
        Welcome to Stellar Swap Web3 Platform
      </h1>

      <WalletSelector
        wallet={wallet}
        onConnect={setWallet}
      />

      {wallet && (
        <p style={{ marginTop: 10 }}>
          Connected: {wallet.address}
        </p>
      )}
    </div>
  );
}