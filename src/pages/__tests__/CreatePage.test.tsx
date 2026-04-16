import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CreatePage from "../CreatePage";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { BrowserRouter } from "react-router-dom";

// Mock the hooks
vi.mock("@mysten/dapp-kit-react", () => ({
  useCurrentAccount: vi.fn(),
  useDAppKit: vi.fn(() => ({})),
  CurrentAccountSigner: vi.fn(),
}));

// Mock icons to avoid rendering complexities in unit tests
vi.mock("lucide-react", () => ({
  Wallet: () => <div data-testid="wallet-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
}));

describe("CreatePage", () => {
  it("shows wallet connection message when no account is connected", () => {
    (useCurrentAccount as any).mockReturnValue(null);

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Connect your SUI wallet to mint this batch/i)).toBeInTheDocument();
  });

  it("renders the form when account is connected", () => {
    (useCurrentAccount as any).mockReturnValue({ address: "0x123" });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mint Product Batch/i })).toBeInTheDocument();
  });

  it("validation: mint button is disabled if required fields are empty", () => {
    (useCurrentAccount as any).mockReturnValue({ address: "0x123" });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    const mintButton = screen.getByRole("button", { name: /Mint Product Batch/i });
    expect(mintButton).toBeDisabled();
  });

  it("enables mint button when required fields are filled", async () => {
    (useCurrentAccount as any).mockReturnValue({ address: "0x123" });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: "Jasmine Rice" } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Grains" } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: "500kg" } });
    fireEvent.change(screen.getByLabelText(/Origin Farm/i), { target: { value: "Farm A" } });
    fireEvent.change(screen.getByLabelText(/Province \/ Region/i), { target: { value: "Province B" } });
    fireEvent.change(screen.getByLabelText(/Certification Note/i), { target: { value: "Organic" } });

    const mintButton = screen.getByRole("button", { name: /Mint Product Batch/i });
    expect(mintButton).not.toBeDisabled();
  });
});
