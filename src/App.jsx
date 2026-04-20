import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import ContractPage from "./pages/ContractPages";
import StatusPage from "./pages/StatusPages";
import SwapPages from "./pages/SwapPages";

import { startEventListener } from "./eventListener";
import { CONTRACT_ID } from "./contractClient";

// ✅ import cache
import { loadCache } from "./utilis/cache";

import "./App.css";

export default function App() {

  const [wallet, setWallet] = useState(null);

  // ✅ Transaction history state (global)
  const [txList, setTxList] = useState([]);

  const [events, setEvents] = useState([]);

  // ✅ LEVEL-3: Restore tx history from cache on app load
  useEffect(() => {
    const cache = loadCache();
    if (cache?.txHistory) {
      setTxList(cache.txHistory);
    }
  }, []);

  // ✅ Start contract event listener
  useEffect(() => {
    if (!CONTRACT_ID) return;

    const stop = startEventListener((evt) =>
      setEvents((prev) => [evt, ...prev].slice(0, 20))
    );

    return stop;
  }, []);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <div className="page-content">
          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  wallet={wallet}
                  setWallet={setWallet}
                  txList={txList}
                />
              }
            />

            <Route
              path="/swap"
              element={
                <SwapPages
                  wallet={wallet}
                  setTxState={setTxList}
                />
              }
            />

            <Route
              path="/events"
              element={<Events events={events} />}
            />

            <Route
              path="/contract"
              element={<ContractPage />}
            />

            <Route
              path="/status"
              element={
                <StatusPage
                  txList={txList}
                />
              }
            />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}