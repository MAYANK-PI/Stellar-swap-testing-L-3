import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// 🔥 MOCKS MUST BE BEFORE IMPORT USAGE
vi.mock("../WalletIntegration", () => ({
  signTransaction: vi.fn(),
}));

vi.mock("../contractClient", () => ({
  buildSwapTx: vi.fn(),
  submitTx: vi.fn(),
  pollTxStatus: vi.fn(),
}));

vi.mock("../utilis/cache", () => ({
  loadCache: () => ({}),
  saveCache: () => {},
}));

import SwapForm from "../components/SwapForm";
import * as contractClient from "../contractClient";

describe("SwapForm UI Tests", () => {
  const mockSetTxState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Test 1 — Renders UI
  test("renders input fields and swap button", () => {
    render(<SwapForm wallet={null} setTxState={mockSetTxState} />);

    expect(screen.getByPlaceholderText("Amount in (XLM)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min amount out")).toBeInTheDocument();
    expect(screen.getByText("Swap")).toBeInTheDocument();
  });

  // ✅ Test 2 — Button disabled when empty
  test("swap button is disabled when inputs are empty", () => {
    render(<SwapForm wallet={null} setTxState={mockSetTxState} />);

    const button = screen.getByText("Swap");
    expect(button).toBeDisabled();
  });

  // ✅ Test 3 — No wallet triggers tx state
  test("clicking swap without wallet triggers tx state", () => {
    render(<SwapForm wallet={null} setTxState={mockSetTxState} />);

    fireEvent.change(screen.getByPlaceholderText("Amount in (XLM)"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByPlaceholderText("Min amount out"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByText("Swap"));

    expect(mockSetTxState).toHaveBeenCalled();
  });

  // ✅ Test 4 — Error flow handling
  test("handles error when swap process fails", async () => {
    const fakeWallet = { publicKey: "GTEST123" };

    contractClient.buildSwapTx.mockRejectedValue(new Error("Swap failed"));

    render(<SwapForm wallet={fakeWallet} setTxState={mockSetTxState} />);

    fireEvent.change(screen.getByPlaceholderText("Amount in (XLM)"), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByPlaceholderText("Min amount out"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByText("Swap"));

    await waitFor(() => {
      expect(mockSetTxState).toHaveBeenCalled();
    });
  });
});