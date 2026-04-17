import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOwnedBatches } from "../useOwnedBatches";
import { useQuery } from "@tanstack/react-query";

// Mock the hooks
vi.mock("@mysten/dapp-kit-react", () => ({
  useCurrentClient: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useOwnedBatches", () => {
  it("should return empty array if no address provided", () => {
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useOwnedBatches(undefined));
    expect(result.current.batches).toEqual([]);
  });

  it("should filter and format fetched origin items properly", () => {
    const mockSuiObjects = [
      {
        data: {
          objectId: "0xabc",
          type: "0x147d9::chain_passport::OriginItem",
          content: {
            fields: {
              name: "Filtered Batch",
              category: "Vegetables",
              province: "Da Lat",
            }
          }
        }
      },
      {
        data: {
          objectId: "0xdef",
          type: "0x9999::spam::NFT",
          content: {}
        } // Should be filtered out
      }
    ];

    (useQuery as any).mockReturnValue({
      data: mockSuiObjects,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useOwnedBatches("0x123"));
    
    // Should filter out the spam NFT and parse the OriginItem correctly
    expect(result.current.batches.length).toBe(1);
    expect(result.current.batches[0].id).toBe("0xabc");
    expect(result.current.batches[0].name).toBe("Filtered Batch");
    expect(result.current.batches[0].category).toBe("Vegetables");
    expect(result.current.batches[0].origin).toBe("Da Lat");
  });

  it("should return loading state correctly", () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useOwnedBatches("0x123"));
    expect(result.current.isLoading).toBe(true);
  });
});
