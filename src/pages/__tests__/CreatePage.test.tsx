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

// Mock the custom hook used in CreatePage
vi.mock("../../hooks/useArtisanProfile", () => ({
  useArtisanProfile: vi.fn(() => ({ profile: { id: "0xprofile" } })),
}));

// Mock icons
vi.mock("lucide-react", () => ({
  Wallet: () => <div data-testid="wallet-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
  Gem: () => <div data-testid="gem-icon" />,
}));

describe("CreatePage", () => {
  it("shows wallet connection message when no account is connected", () => {
    (useCurrentAccount as any).mockReturnValue(null);

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Connect your SUI wallet to mint/i)).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /Mint Certificate/i })).toBeInTheDocument();
  });

  it("validation: mint button is disabled if required fields are empty", () => {
    (useCurrentAccount as any).mockReturnValue({ address: "0x123" });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    const mintButton = screen.getByRole("button", { name: /Mint Certificate/i });
    expect(mintButton).toBeDisabled();
  });

  it("enables mint button when required fields are filled", async () => {
    (useCurrentAccount as any).mockReturnValue({ address: "0x123" });

    render(
      <BrowserRouter>
        <CreatePage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: "Celadon Vase" } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Ceramics" } });
    fireEvent.change(screen.getByLabelText(/Artisan Name/i), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText(/Location \/ Studio/i), { target: { value: "Hanoi" } });
    fireEvent.change(screen.getByLabelText(/Materials/i), { target: { value: "Clay" } });

    const mintButton = screen.getByRole("button", { name: /Mint Certificate/i });
    expect(mintButton).not.toBeDisabled();
  });
});
