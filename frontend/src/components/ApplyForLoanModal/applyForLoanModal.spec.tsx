import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "~/test/testUtils";
import { setup } from "~/test/testUtils";
import { loanRequestFactory } from "~/test/factories/loanRequestFactory";
import { ApplyForLoanModal } from "./applyForLoanModal";

describe("ApplyForLoanModal", () => {
  it("renders all form fields when open", () => {
    renderWithProviders(<ApplyForLoanModal open={true} onClose={vi.fn()} />);

    expect(screen.getByTestId("apply-for-loan-modal-heading")).toBeInTheDocument();
    expect(screen.getByTestId("apply-for-loan-modal-amount")).toBeInTheDocument();
    expect(screen.getByTestId("apply-for-loan-modal-term-months")).toBeInTheDocument();
    expect(screen.getByTestId("apply-for-loan-modal-monthly-rate")).toBeInTheDocument();
    expect(screen.getByTestId("apply-for-loan-modal-submit")).toBeInTheDocument();
  });

  it("calls onClose after successful submission", async () => {
    server.use(
      http.post("http://localhost:8000/products/loans/", () =>
        HttpResponse.json(loanRequestFactory.build(), { status: 201 })
      )
    );
    const onClose = vi.fn();
    const user = setup();
    renderWithProviders(<ApplyForLoanModal open={true} onClose={onClose} />);

    await user.type(screen.getByTestId("apply-for-loan-modal-amount"), "5000000");
    await user.type(screen.getByTestId("apply-for-loan-modal-term-months"), "24");
    await user.type(screen.getByTestId("apply-for-loan-modal-monthly-rate"), "1.5");
    await user.click(screen.getByTestId("apply-for-loan-modal-submit"));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("shows validation errors when form is submitted empty", async () => {
    const user = setup();
    renderWithProviders(<ApplyForLoanModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByTestId("apply-for-loan-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("apply-for-loan-modal-amount-error")).toHaveTextContent(
        /loan amount is required/i
      )
    );
  });

  it("shows API error on submission failure", async () => {
    server.use(
      http.post("http://localhost:8000/products/loans/", () =>
        HttpResponse.json({ amount: ["This field is required."] }, { status: 400 })
      )
    );
    const user = setup();
    renderWithProviders(<ApplyForLoanModal open={true} onClose={vi.fn()} />);

    await user.type(screen.getByTestId("apply-for-loan-modal-amount"), "5000000");
    await user.type(screen.getByTestId("apply-for-loan-modal-term-months"), "24");
    await user.type(screen.getByTestId("apply-for-loan-modal-monthly-rate"), "1.5");
    await user.click(screen.getByTestId("apply-for-loan-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("apply-for-loan-modal-error")).toBeInTheDocument()
    );
  });
});
