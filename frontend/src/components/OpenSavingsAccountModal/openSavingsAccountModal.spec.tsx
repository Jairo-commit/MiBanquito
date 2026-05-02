import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "~/test/testUtils";
import { setup } from "~/test/testUtils";
import { accountFactory } from "~/test/factories/accountFactory";
import { OpenSavingsAccountModal } from "./openSavingsAccountModal";

describe("OpenSavingsAccountModal", () => {
  it("renders the form when open", () => {
    renderWithProviders(<OpenSavingsAccountModal open={true} onClose={vi.fn()} />);

    expect(screen.getByTestId("open-savings-account-modal-heading")).toBeInTheDocument();
    expect(screen.getByTestId("open-savings-account-modal-balance")).toBeInTheDocument();
    expect(screen.getByTestId("open-savings-account-modal-submit")).toBeInTheDocument();
  });

  it("calls onClose after successful submission", async () => {
    server.use(
      http.post("http://localhost:8000/accounts/", () =>
        HttpResponse.json(accountFactory.build(), { status: 201 })
      )
    );
    const onClose = vi.fn();
    const user = setup();
    renderWithProviders(<OpenSavingsAccountModal open={true} onClose={onClose} />);

    await user.type(screen.getByTestId("open-savings-account-modal-balance"), "500000");
    await user.click(screen.getByTestId("open-savings-account-modal-submit"));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("shows validation error when balance is empty on submit", async () => {
    const user = setup();
    renderWithProviders(<OpenSavingsAccountModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByTestId("open-savings-account-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("open-savings-account-modal-balance-error")).toHaveTextContent(
        /initial deposit is required/i
      )
    );
  });

  it("shows validation error when balance is below minimum", async () => {
    const user = setup();
    renderWithProviders(<OpenSavingsAccountModal open={true} onClose={vi.fn()} />);

    await user.type(screen.getByTestId("open-savings-account-modal-balance"), "50000");
    await user.tab();

    await waitFor(() =>
      expect(screen.getByTestId("open-savings-account-modal-balance-error")).toHaveTextContent(
        /minimum opening deposit is COP 100,000/i
      )
    );
  });

  it("shows API error on submission failure", async () => {
    server.use(
      http.post("http://localhost:8000/accounts/", () =>
        HttpResponse.json(
          { balance: ["The minimum balance to open an account is $100,000."] },
          { status: 400 }
        )
      )
    );
    const user = setup();
    renderWithProviders(<OpenSavingsAccountModal open={true} onClose={vi.fn()} />);

    await user.type(screen.getByTestId("open-savings-account-modal-balance"), "500000");
    await user.click(screen.getByTestId("open-savings-account-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("open-savings-account-modal-error")).toBeInTheDocument()
    );
  });
});
