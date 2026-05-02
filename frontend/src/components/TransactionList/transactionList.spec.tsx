import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "~/test/testUtils";
import { transactionFactory } from "~/test/factories/transactionFactory";
import { userResponseFactory } from "~/test/factories/userResponseFactory";
import { TransactionList } from "./transactionList";

describe("TransactionList", () => {
  it("shows loading skeleton while fetching", () => {
    renderWithProviders(<TransactionList />);

    expect(screen.getByTestId("transactionlist-loading")).toBeInTheDocument();
  });

  it("renders a row for each transaction after loading", async () => {
    renderWithProviders(<TransactionList />);

    await waitFor(() =>
      expect(screen.getByTestId("transactionlist-item")).toBeInTheDocument()
    );
  });

  it("renders nothing when transactions list is empty", async () => {
    server.use(
      http.get("http://localhost:8000/transactions/", () =>
        HttpResponse.json({ results: [] })
      )
    );

    renderWithProviders(<TransactionList />);

    await waitFor(() =>
      expect(
        screen.queryByTestId("transactionlist-loading")
      ).not.toBeInTheDocument()
    );
    expect(
      screen.queryByTestId("transactionlist-item")
    ).not.toBeInTheDocument();
  });

  it("renders one row per transaction when multiple are returned", async () => {
    server.use(
      http.get("http://localhost:8000/transactions/", () =>
        HttpResponse.json({ results: transactionFactory.buildList(3) })
      )
    );

    renderWithProviders(<TransactionList />);

    await waitFor(() =>
      expect(screen.getAllByTestId("transactionlist-item")).toHaveLength(3)
    );
  });

  it("shows source and destination holder names for superuser", async () => {
    server.use(
      http.get("http://localhost:8000/user/me/", () =>
        HttpResponse.json(userResponseFactory.build({ is_superuser: true }))
      ),
      http.get("http://localhost:8000/transactions/", () =>
        HttpResponse.json({
          results: [
            transactionFactory.build({
              source_account_holder: "John Doe",
              destination_account_holder: "Jane Smith",
            }),
          ],
        })
      )
    );

    renderWithProviders(<TransactionList />);

    await waitFor(() =>
      expect(screen.getByTestId("transactionlist-item")).toHaveTextContent(
        "John Doe → Jane Smith"
      )
    );
  });
});
