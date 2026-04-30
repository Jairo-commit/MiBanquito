import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "~/test/testUtils";
import { accountFactory } from "~/test/factories/accountFactory";
import { AccountPanel } from "./accountPanel";

describe("AccountPanel", () => {
  it("renders formatted balance and account number", () => {
    const account = accountFactory.build({ balance: "1000000.00" });

    renderWithProviders(<AccountPanel account={account} />);

    expect(screen.getByTestId("accountpanel-balance")).toHaveTextContent(
      "$ 1.000.000"
    );
    expect(screen.getByTestId("accountpanel-account-number")).toHaveTextContent(
      account.account_number
    );
  });
});
