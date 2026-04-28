import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "~/test/testUtils";
import { accountFactory } from "~/test/factories/accountFactory";
import { AccountPanelList } from "./accountPanelList";

describe("AccountPanelList", () => {
  it("shows loading skeleton while fetching", () => {
    renderWithProviders(<AccountPanelList />);

    expect(screen.getByTestId("accountpanellist-loading")).toBeInTheDocument();
  });

  it("renders an AccountPanel for each account after loading", async () => {
    renderWithProviders(<AccountPanelList />);

    await waitFor(() =>
      expect(screen.getByTestId("accountpanel-account-number")).toBeInTheDocument()
    );
  });

  it("renders nothing when accounts list is empty", async () => {
    server.use(
      http.get("http://localhost:8000/accounts/", () =>
        HttpResponse.json({ results: [] })
      )
    );

    renderWithProviders(<AccountPanelList />);

    await waitFor(() =>
      expect(
        screen.queryByTestId("accountpanellist-loading")
      ).not.toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("accountpanel-account-number")
    ).not.toBeInTheDocument();
  });

  it("renders one AccountPanel per account when multiple accounts are returned", async () => {
    const accounts = accountFactory.buildList(3);
    server.use(
      http.get("http://localhost:8000/accounts/", () =>
        HttpResponse.json({ results: accounts })
      )
    );

    renderWithProviders(<AccountPanelList />);

    await waitFor(() =>
      expect(screen.getAllByTestId("accountpanel-account-number")).toHaveLength(3)
    );
  });
});
