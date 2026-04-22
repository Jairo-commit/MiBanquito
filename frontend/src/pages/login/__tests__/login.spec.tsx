import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { authTokenFactory } from "~/test/factories/authTokenFactory";
import { renderWithProviders, screen, waitFor, userEvent } from "~/test/testUtils";
import { Login } from "../login";

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

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  it("stores tokens in localStorage and navigates to / on success", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByRole("textbox", { name: /username/i }), "testuser");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

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
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByRole("textbox", { name: /username/i }), "testuser");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

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
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByRole("textbox", { name: /username/i }), "wrong");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent(
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
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByRole("textbox", { name: /username/i }), "wrong");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
    expect(screen.getByRole("alert")).not.toHaveTextContent("non_field_errors");
  });

  it("disables the submit button while the mutation is pending", async () => {
    server.use(
      http.post("http://localhost:8000/token/", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json(authTokenFactory());
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByRole("textbox", { name: /username/i }), "testuser");
    await user.type(screen.getByLabelText(/password/i), "secret123");

    const button = screen.getByRole("button", { name: /sign in/i });
    await user.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
