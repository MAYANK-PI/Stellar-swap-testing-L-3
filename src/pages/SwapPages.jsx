import SwapForm from "../components/SwapForm";

export default function SwapPages({ wallet, setTxState }) {
  if (!wallet) {
    return <p> wallet not connected</p>;
  }

  return (
    <div>
      <h1 className="page-title">Swap XLM → Token</h1>

      <SwapForm wallet={wallet} setTxState={setTxState} />
    </div>
  );
}
