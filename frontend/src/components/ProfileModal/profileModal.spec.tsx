import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "~/test/mocks/server";
import { renderWithProviders, screen, waitFor, setup } from "~/test/testUtils";
import { ProfileModal } from "./profileModal";

const testUser = {
  id: "1",
  username: "testuser",
  email: "test@example.com",
  document_type: "CC",
  document_number: "123456789",
  full_name: "Test User",
  city: "Bogotá",
  phone: "3001234567",
  is_superuser: false,
};

const onClose = vi.fn();

afterEach(() => {
  onClose.mockClear();
});

describe("ProfileModal", () => {
  beforeEach(() => {
    server.use(
      http.get("http://localhost:8000/user/me/", () =>
        HttpResponse.json(testUser)
      )
    );
  });

  it("renders user data when open", async () => {
    renderWithProviders(<ProfileModal open={true} onClose={onClose} />);

    await waitFor(() =>
      expect(screen.getByTestId("profile-modal-fullname")).toBeInTheDocument()
    );
    expect(screen.getByTestId("profile-modal-fullname")).toHaveTextContent("Test User");
    expect(screen.getByTestId("profile-modal-email")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("profile-modal-document")).toHaveTextContent("CC 123456789");
    expect(screen.getByTestId("profile-modal-city")).toHaveTextContent("Bogotá");
    expect(screen.getByTestId("profile-modal-phone")).toHaveTextContent("3001234567");
  });

  it("does not render when open is false", () => {
    renderWithProviders(<ProfileModal open={false} onClose={onClose} />);

    expect(screen.queryByTestId("profile-modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = setup();
    renderWithProviders(<ProfileModal open={true} onClose={onClose} />);

    await user.click(screen.getByTestId("profile-modal-close"));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
