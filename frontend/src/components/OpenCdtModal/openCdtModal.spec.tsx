import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor } from "~/test/testUtils";
import { setup } from "~/test/testUtils";
import { cdtFactory } from "~/test/factories/cdtFactory";
import { OpenCdtModal } from "./openCdtModal";

describe("OpenCdtModal", () => {
  it("renders all form fields when open", () => {
    renderWithProviders(<OpenCdtModal open={true} onClose={vi.fn()} />);

    expect(screen.getByTestId("open-cdt-modal-heading")).toBeInTheDocument();
    expect(screen.getByTestId("open-cdt-modal-amount")).toBeInTheDocument();
    expect(screen.getByTestId("open-cdt-modal-term-days")).toBeInTheDocument();
    expect(screen.getByTestId("open-cdt-modal-annual-rate")).toBeInTheDocument();
    expect(screen.getByTestId("open-cdt-modal-maturity-date")).toBeInTheDocument();
    expect(screen.getByTestId("open-cdt-modal-submit")).toBeInTheDocument();
  });

  it("calls onClose after successful submission", async () => {
    server.use(
      http.post("http://localhost:8000/products/cdts/", () =>
        HttpResponse.json(cdtFactory.build(), { status: 201 })
      )
    );
    const onClose = vi.fn();
    const user = setup();
    renderWithProviders(<OpenCdtModal open={true} onClose={onClose} />);

    await user.type(screen.getByTestId("open-cdt-modal-amount"), "2000000");
    await user.type(screen.getByTestId("open-cdt-modal-term-days"), "180");
    await user.type(screen.getByTestId("open-cdt-modal-annual-rate"), "8");
    await user.type(screen.getByTestId("open-cdt-modal-maturity-date"), "2027-01-01");
    await user.click(screen.getByTestId("open-cdt-modal-submit"));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it("shows validation errors when form is submitted empty", async () => {
    const user = setup();
    renderWithProviders(<OpenCdtModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByTestId("open-cdt-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("open-cdt-modal-amount-error")).toHaveTextContent(
        /investment amount is required/i
      )
    );
  });

  it("shows API error on submission failure", async () => {
    server.use(
      http.post("http://localhost:8000/products/cdts/", () =>
        HttpResponse.json({ amount: ["This field is required."] }, { status: 400 })
      )
    );
    const user = setup();
    renderWithProviders(<OpenCdtModal open={true} onClose={vi.fn()} />);

    await user.type(screen.getByTestId("open-cdt-modal-amount"), "2000000");
    await user.type(screen.getByTestId("open-cdt-modal-term-days"), "180");
    await user.type(screen.getByTestId("open-cdt-modal-annual-rate"), "8");
    await user.type(screen.getByTestId("open-cdt-modal-maturity-date"), "2027-01-01");
    await user.click(screen.getByTestId("open-cdt-modal-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("open-cdt-modal-error")).toBeInTheDocument()
    );
  });
});
