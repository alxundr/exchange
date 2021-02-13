import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { server } from "../mocks/server";
import { rest } from "msw";
import { QueryClient, QueryClientProvider } from "react-query";

const renderApp = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe("App Component", () => {
  test("shows loading", async () => {
    renderApp();
    expect(screen.queryByText(/loading.../)).not.toBeNull();
  });

  test("creates ForeignExchange and passes props", async () => {
    server.use(
      rest.get("/pockets", (req, res, ctx) => {
        return res(
          ctx.json({
            pockets: [
              {
                amount: 1,
                currency: "GBP",
              },
              {
                amount: 2,
                currency: "EUR",
              },
            ],
          })
        );
      }),
      rest.get("/exchange", (req, res, ctx) => {
        return res(
          ctx.json({
            rates: {
              EUR: 1.23,
              USD: 4.56,
            },
          })
        );
      })
    );
    renderApp();
    expect(screen.queryByText(/loading.../)).not.toBeNull();
    await waitFor(() => expect(screen.queryByText(/loading.../)).toBeNull());
  });
});
