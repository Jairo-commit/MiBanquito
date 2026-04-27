import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { userResponseFactory } from "~/test/factories/userResponseFactory";
import { renderWithProviders, screen, waitFor, setup } from "~/test/testUtils";
import { Register } from "./register";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

async function fillRequiredFields(user: ReturnType<typeof setup>) {
  await user.type(screen.getByTestId("register-username"), "testuser");
  await user.type(screen.getByTestId("register-email"), "test@example.com");
  await user.type(screen.getByTestId("register-password"), "password123");
  await user.type(screen.getByTestId("register-confirm-password"), "password123");
  await user.type(screen.getByTestId("register-document-number"), "123456789");
}

describe("Register", () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the registration form", () => {
    renderWithProviders(<Register />);

    expect(screen.getByTestId("register-heading")).toBeInTheDocument();
    expect(screen.getByTestId("register-username")).toBeInTheDocument();
    expect(screen.getByTestId("register-email")).toBeInTheDocument();
    expect(screen.getByTestId("register-password")).toBeInTheDocument();
    expect(screen.getByTestId("register-confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("register-document-type")).toBeInTheDocument();
    expect(screen.getByTestId("register-document-number")).toBeInTheDocument();
    expect(screen.getByTestId("register-full-name")).toBeInTheDocument();
    expect(screen.getByTestId("register-city")).toBeInTheDocument();
    expect(screen.getByTestId("register-phone")).toBeInTheDocument();
    expect(screen.getByTestId("register-submit")).toBeInTheDocument();
  });

  it("navigates to /login on successful registration", async () => {
    const user = setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByTestId("register-submit"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("uses factory data in success response", async () => {
    server.use(
      http.post("http://localhost:8000/user/register/", () =>
        HttpResponse.json(userResponseFactory({ username: "jairo" }), { status: 201 })
      )
    );
    const user = setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByTestId("register-submit"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("shows required field errors when submitting empty form", async () => {
    const user = setup();
    renderWithProviders(<Register />);

    await user.click(screen.getByTestId("register-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("register-username-error")).toHaveTextContent(/username is required/i)
    );
    expect(screen.getByTestId("register-email-error")).toHaveTextContent(/please enter a valid email/i);
    expect(screen.getByTestId("register-password-error")).toHaveTextContent(/password must be at least 8 characters/i);
    expect(screen.getByTestId("register-document-number-error")).toHaveTextContent(/document number is required/i);
  });

  it("shows validation error for invalid email on blur", async () => {
    const user = setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByTestId("register-email"), "not-an-email");
    await user.tab();

    await waitFor(() =>
      expect(screen.getByTestId("register-email-error")).toHaveTextContent(/please enter a valid email/i)
    );
  });

  it("shows validation error when passwords do not match on blur", async () => {
    const user = setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByTestId("register-password"), "password123");
    await user.type(screen.getByTestId("register-confirm-password"), "different123");
    await user.tab();

    await waitFor(() =>
      expect(screen.getByTestId("register-confirm-password-error")).toHaveTextContent(/passwords do not match/i)
    );
  });

  it("shows validation error when confirmPassword is empty on submit", async () => {
    const user = setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByTestId("register-password"), "password123");
    await user.click(screen.getByTestId("register-submit"));

    await waitFor(() =>
      expect(screen.getByTestId("register-confirm-password-error")).toHaveTextContent(/please confirm your password/i)
    );
  });

  it("shows API error alert on registration failure", async () => {
    server.use(
      http.post("http://localhost:8000/user/register/", () =>
        HttpResponse.json(
          { username: ["A user with that username already exists."] },
          { status: 400 }
        )
      )
    );
    const user = setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByTestId("register-submit"));

    await waitFor(() => expect(screen.getByTestId("register-error")).toBeInTheDocument());
    expect(screen.getByTestId("register-error")).toHaveTextContent(
      "username: A user with that username already exists."
    );
  });
});
