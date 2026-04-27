import React from "react";
import { render, screen, waitFor, within, fireEvent, type RenderOptions, type RenderResult } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { CustomTheme } from "~/mui/customTheme";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  routerProps?: MemoryRouterProps;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  { routerProps, ...renderOptions }: RenderWithProvidersOptions = {}
): RenderResult {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>
          <CustomTheme>{children}</CustomTheme>
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { screen, waitFor, within, fireEvent };
export const setup = () => userEvent.setup();
