import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor, setup } from "~/test/testUtils";
import { Navbar } from "./navbar";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Navbar", () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it("renders Account and About Us buttons", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByTestId("navbar-account-btn")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-aboutus-btn")).toBeInTheDocument();
  });

  it("renders user menu button after user data loads", async () => {
    renderWithProviders(<Navbar />);

    await waitFor(() =>
      expect(screen.getByTestId("navbar-user-menu-btn")).toBeInTheDocument()
    );
  });

  it("does not render user menu button when /user/me/ returns 401", async () => {
    server.use(
      http.get("http://localhost:8000/user/me/", () =>
        HttpResponse.json({ detail: "Unauthorized" }, { status: 401 })
      )
    );
    renderWithProviders(<Navbar />);

    await waitFor(() =>
      expect(screen.queryByTestId("navbar-user-menu-btn")).not.toBeInTheDocument()
    );
  });

  it("opens menu when clicking the icon button", async () => {
    const user = setup();
    renderWithProviders(<Navbar />);

    await waitFor(() =>
      expect(screen.getByTestId("navbar-user-menu-btn")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("navbar-user-menu-btn"));

    await waitFor(() =>
      expect(screen.getByTestId("navbar-profile-item")).toBeVisible()
    );
    expect(screen.getByTestId("navbar-logout-item")).toBeVisible();
  });

  it("closes menu when clicking Profile", async () => {
    const user = setup();
    renderWithProviders(<Navbar />);

    await waitFor(() =>
      expect(screen.getByTestId("navbar-user-menu-btn")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("navbar-user-menu-btn"));
    await waitFor(() =>
      expect(screen.getByTestId("navbar-profile-item")).toBeVisible()
    );

    await user.click(screen.getByTestId("navbar-profile-item"));

    await waitFor(() =>
      expect(screen.getByTestId("navbar-profile-item")).not.toBeVisible()
    );
  });

  it("closes menu when clicking Logout", async () => {
    const user = setup();
    renderWithProviders(<Navbar />);

    await waitFor(() =>
      expect(screen.getByTestId("navbar-user-menu-btn")).toBeInTheDocument()
    );
    await user.click(screen.getByTestId("navbar-user-menu-btn"));
    await waitFor(() =>
      expect(screen.getByTestId("navbar-logout-item")).toBeVisible()
    );

    await user.click(screen.getByTestId("navbar-logout-item"));

    await waitFor(() =>
      expect(screen.getByTestId("navbar-logout-item")).not.toBeVisible()
    );
  });

  it("navigates to / when clicking Account button", async () => {
    const user = setup();
    renderWithProviders(<Navbar />);

    await user.click(screen.getByTestId("navbar-account-btn"));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
