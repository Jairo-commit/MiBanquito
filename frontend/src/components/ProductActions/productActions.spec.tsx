import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "~/test/testUtils";
import { setup } from "~/test/testUtils";
import { ProductActions } from "./productActions";

describe("ProductActions", () => {
  it("renders all three action buttons", () => {
    renderWithProviders(<ProductActions />);

    expect(screen.getByTestId("product-actions-open-savings")).toBeInTheDocument();
    expect(screen.getByTestId("product-actions-apply-loan")).toBeInTheDocument();
    expect(screen.getByTestId("product-actions-open-cdt")).toBeInTheDocument();
  });

  it("opens savings account modal when first button is clicked", async () => {
    const user = setup();
    renderWithProviders(<ProductActions />);

    await user.click(screen.getByTestId("product-actions-open-savings"));

    expect(screen.getByTestId("open-savings-account-modal-heading")).toBeInTheDocument();
  });

  it("opens loan modal when second button is clicked", async () => {
    const user = setup();
    renderWithProviders(<ProductActions />);

    await user.click(screen.getByTestId("product-actions-apply-loan"));

    expect(screen.getByTestId("apply-for-loan-modal-heading")).toBeInTheDocument();
  });

  it("opens CDT modal when third button is clicked", async () => {
    const user = setup();
    renderWithProviders(<ProductActions />);

    await user.click(screen.getByTestId("product-actions-open-cdt"));

    expect(screen.getByTestId("open-cdt-modal-heading")).toBeInTheDocument();
  });
});
