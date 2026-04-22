import { describe, it, expect, vi, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { userResponseFactory } from "~/test/factories/userResponseFactory";
import { renderWithProviders, screen, waitFor, userEvent } from "~/test/testUtils";
import { Register } from "../register";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: /username/i }), "testuser");
  await user.type(screen.getByRole("textbox", { name: /email/i }), "test@example.com");
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.type(screen.getByLabelText(/confirm password/i), "password123");
  await user.type(screen.getByRole("textbox", { name: /document number/i }), "123456789");
}

describe("Register", () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the registration form", () => {
    renderWithProviders(<Register />);

    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /document type/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /document number/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /city/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /phone/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("navigates to /login on successful registration", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("uses factory data in success response", async () => {
    server.use(
      http.post("http://localhost:8000/user/register/", () =>
        HttpResponse.json(userResponseFactory({ username: "jairo" }), { status: 201 })
      )
    );
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  it("shows required field errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/document number is required/i)).toBeInTheDocument();
  });

  it("shows validation error for invalid email on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByRole("textbox", { name: /email/i }), "not-an-email");
    await user.tab();

    await waitFor(() =>
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    );
  });

  it("shows validation error when passwords do not match on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different123");
    await user.tab();

    await waitFor(() =>
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    );
  });

  it("shows validation error when confirmPassword is empty on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
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
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("alert")).toHaveTextContent(
      "username: A user with that username already exists."
    );
  });
});
