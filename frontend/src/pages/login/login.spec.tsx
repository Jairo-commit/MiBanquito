import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { authTokenFactory } from "~/test/factories/authTokenFactory";
import { renderWithProviders, screen, waitFor, setup } from "~/test/testUtils";
import { Login } from "./login";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Login", () => {
  afterEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("renders the login form", () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId("login-heading")).toBeInTheDocument();
    expect(screen.getByTestId("login-username")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    expect(screen.getByTestId("login-register-link")).toBeInTheDocument();
  });

  it("stores tokens in localStorage and navigates to / on success", async () => {
    const user = setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByTestId("login-username"), "testuser");
    await user.type(screen.getByTestId("login-password"), "secret123");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    expect(localStorage.getItem("access")).toBe("fake-access-token");
    expect(localStorage.getItem("refresh")).toBe("fake-refresh-token");
  });

  it("stores custom token from factory override", async () => {
    server.use(
      http.post("http://localhost:8000/token/", () =>
        HttpResponse.json(authTokenFactory({ access: "custom-access-token" }))
      )
    );
    const user = setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByTestId("login-username"), "testuser");
    await user.type(screen.getByTestId("login-password"), "secret123");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => expect(localStorage.getItem("access")).toBe("custom-access-token"));
  });

  it("shows error alert with field prefix on API 401", async () => {
    server.use(
      http.post("http://localhost:8000/token/", () =>
        HttpResponse.json(
          { detail: "No active account found with the given credentials" },
          { status: 401 }
        )
      )
    );
    const user = setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByTestId("login-username"), "wrong");
    await user.type(screen.getByTestId("login-password"), "wrong");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => expect(screen.getByTestId("login-error")).toBeInTheDocument());
    expect(screen.getByTestId("login-error")).toHaveTextContent(
      "detail: No active account found with the given credentials"
    );
  });

  it("shows non_field_errors without key prefix", async () => {
    server.use(
      http.post("http://localhost:8000/token/", () =>
        HttpResponse.json(
          { non_field_errors: ["Invalid credentials"] },
          { status: 400 }
        )
      )
    );
    const user = setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByTestId("login-username"), "wrong");
    await user.type(screen.getByTestId("login-password"), "wrong");
    await user.click(screen.getByTestId("login-submit"));

    await waitFor(() => expect(screen.getByTestId("login-error")).toBeInTheDocument());
    expect(screen.getByTestId("login-error")).toHaveTextContent("Invalid credentials");
    expect(screen.getByTestId("login-error")).not.toHaveTextContent("non_field_errors");
  });

  it("disables the submit button while the mutation is pending", async () => {
    server.use(
      http.post("http://localhost:8000/token/", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json(authTokenFactory());
      })
    );
    const user = setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByTestId("login-username"), "testuser");
    await user.type(screen.getByTestId("login-password"), "secret123");

    const button = screen.getByTestId("login-submit");
    await user.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
