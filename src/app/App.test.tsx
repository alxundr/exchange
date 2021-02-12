import * as React from "react";
import { mount, ReactWrapper } from "enzyme";
import "whatwg-fetch";
import fetchMock from "fetch-mock";
import { act } from "react-dom/test-utils";
import App from "./App";
import ForeignExchange from "./foreign-exchange/ForeignExchange";
import { getAmount } from "../domain/amount";
import { AllowedCurrencies } from "../domain/currency";
import { OPEN_EXCHANGE_ENDPOINT } from "../proxy/rates";

import { QueryClient, QueryClientProvider } from "react-query";

let app: ReactWrapper;

const renderApp = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  await act(async () => {
    app = mount(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  });
};

describe("App Component", () => {
  beforeAll(() => {
    global["fetch"] = fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    app.unmount();
  });

  afterAll(() => {
    fetchMock.restore();
  });

  test("shows loading", async () => {
    await renderApp();
    expect(app.find("div").at(0).text()).toContain("loading...");
  });

  test("creates ForeignExchange and passes props", async () => {
    fetchMock.mock("./data/input.json", {
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
    });
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        EUR: 1.23,
        USD: 4.56,
      },
    });
    await renderApp();
    app.update();
    const props = {
      input: getAmount(0, AllowedCurrencies.GBP),
      output: getAmount(0, AllowedCurrencies.EUR),
      rates: {
        EUR: 1.23,
        USD: 4.56,
      },
      pockets: [getAmount(1, AllowedCurrencies.GBP), getAmount(2, AllowedCurrencies.EUR)],
    };
    expect(app.find(ForeignExchange).props().input.isSame(props.input)).toEqual(true);
    expect(app.find(ForeignExchange).props().output.isSame(props.output)).toEqual(true);
    expect(app.find(ForeignExchange).props().rates).toEqual(props.rates);
  });
});
