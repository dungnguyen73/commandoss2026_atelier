import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBatchData } from "../useBatchData";

import { useQuery } from "@tanstack/react-query";

// Mock the hooks
vi.mock("@mysten/dapp-kit-react", () => ({
  useCurrentClient: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useBatchData", () => {
  it("should return null if objectId is not provided", () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBatchData(undefined));
    expect(result.current.batch).toBeNull();
  });

  it("should parse batch data correctly in successful response", async () => {
    const mockFields = {
      name: "Organic Coffee",
      category: "Beverage",
    };

    (useQuery as any).mockReturnValue({
      data: {
        object: {
          json: mockFields,
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBatchData("0x123"));
    
    expect(result.current.batch).toEqual(mockFields);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return isLoading correctly", () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBatchData("0x123"));
    expect(result.current.isLoading).toBe(true);
  });
});
