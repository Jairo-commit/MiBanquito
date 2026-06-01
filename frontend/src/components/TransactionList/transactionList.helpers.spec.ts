import { describe, it, expect } from "vitest";
import { transactionFactory } from "~/test/factories/transactionFactory";
import {
  formatAmount,
  formatDate,
  getTransactionParties,
} from "./transactionList.helpers";

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

describe("getTransactionParties", () => {
  it("returns holder names for a superuser", () => {
    const tx = transactionFactory.build({
      source_account_holder: "John Doe",
      destination_account_holder: "Jane Smith",
    });

    expect(getTransactionParties(tx, true)).toEqual({
      source: "John Doe",
      destination: "Jane Smith",
    });
  });

  it("returns account numbers for a regular user", () => {
    const tx = transactionFactory.build({
      source_account_number: "MB-SRC-0001-2025",
      destination_account_number: "MB-DST-0001-2025",
    });

    expect(getTransactionParties(tx, false)).toEqual({
      source: "MB-SRC-0001-2025",
      destination: "MB-DST-0001-2025",
    });
  });

  it("falls back to a dash when a value is null", () => {
    const tx = transactionFactory.build({
      source_account_holder: null,
      destination_account_holder: null,
    });

    expect(getTransactionParties(tx, true)).toEqual({
      source: "—",
      destination: "—",
    });
  });
});
