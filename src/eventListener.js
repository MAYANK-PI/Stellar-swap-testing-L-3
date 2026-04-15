import { rpc as SorobanRpc, scValToNative } from "@stellar/stellar-sdk";
import { CONTRACT_ID } from "./contractClient";

const SERVER = new SorobanRpc.Server(
  "https://soroban-testnet.stellar.org"
);


// ✅ Decode topic correctly (symbol_short!("swap"))
function decodeTopic(topic) {
  try {
    if (!topic || topic.length === 0) return "event";

    return scValToNative(topic[0]) || "event";
  } catch {
    return "event";
  }
}


// ✅ Decode value correctly (stroops → XLM)
function decodeValue(value) {
  try {
    const decoded = scValToNative(value);

    if (typeof decoded === "bigint") {
      return (Number(decoded) / 1e7).toFixed(2) + " XLM";
    }

    if (typeof decoded === "number") {
      return (decoded / 1e7).toFixed(2) + " XLM";
    }

    return JSON.stringify(decoded);
  } catch {
    return "0 XLM";
  }
}


export function startEventListener(onEvent) {

  let startLedger = null;

  const poll = async () => {
    try {

      // ✅ Get latest ledger first time only
      if (!startLedger) {
        const latestLedger = await SERVER.getLatestLedger();
        startLedger = latestLedger.sequence;
      }

      const response = await SERVER.getEvents({
        startLedger,
        filters: [
          {
            type: "contract",
            contractIds: [CONTRACT_ID],
          },
        ],
        limit: 10,
      });

      if (response.events?.length > 0) {

        response.events.forEach((evt) => {

          startLedger = evt.ledger + 1;

          onEvent({
            id: evt.id,
            type: decodeTopic(evt.topic),   // ✅ swap
            data: decodeValue(evt.value),   // ✅ FIXED HERE
            ledger: evt.ledger,
            time: new Date().toLocaleTimeString(),
          });

        });

      }

    } catch (err) {
      console.error("Event listener error:", err);
    }
  };

  poll();

  const interval = setInterval(poll, 5000);

  return () => clearInterval(interval);
}