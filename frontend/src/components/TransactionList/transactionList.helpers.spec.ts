import { describe, it, expect } from "vitest";
import { formatAmount, formatDate } from "./transactionList.helpers";

const fmtAmount = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (date: Date) =>
  new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

describe("formatAmount", () => {
  it("formats a positive amount", () => {
    expect(formatAmount("500000.00")).toBe(fmtAmount(500000));
  });

  it("formats zero", () => {
    expect(formatAmount("0")).toBe(fmtAmount(0));
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    const isoDate = new Date(2025, 0, 15).toISOString();
    expect(formatDate(isoDate)).toBe(fmtDate(new Date(isoDate)));
  });
});
