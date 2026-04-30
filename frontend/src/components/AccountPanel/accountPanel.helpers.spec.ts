import { describe, it, expect } from "vitest";
import { formatBalance } from "./accountPanel.helpers";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

describe("formatBalance", () => {
  it("formats a positive balance", () => {
    expect(formatBalance("1000000.00")).toBe(fmt(1000000));
  });

  it("formats zero", () => {
    expect(formatBalance("0")).toBe(fmt(0));
  });

  it("formats a decimal balance rounding up", () => {
    expect(formatBalance("1500.75")).toBe(fmt(1501));
  });
});
