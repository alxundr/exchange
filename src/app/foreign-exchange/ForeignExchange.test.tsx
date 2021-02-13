import React from "react";

import { getAmount } from "../../domain/amount";
import { AllowedCurrencies } from "../../domain/currency";
import { State } from "../../store/state";
import ForeignExchange from "./ForeignExchange";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { fireEvent, screen, render, act, waitFor } from "@testing-library/react";

describe("ForeignExchange", () => {
  const initialState = (): State => ({
    pockets: [getAmount(1), getAmount(1, AllowedCurrencies.EUR), getAmount(1, AllowedCurrencies.USD)],
    rates: {
      USD: 1,
      EUR: 1,
      GBP: 1,
    },
    input: getAmount(0),
    output: getAmount(0, AllowedCurrencies.EUR),
  });

  const updateInputAmount = (newAmount: number) => {
    const input = screen.getByTestId("input-amount");
    fireEvent.change(input, { target: { value: newAmount } });
  };

  const advanceIntervalBy = async (time: number) => {
    await act(async () => {
      jest.advanceTimersByTime(time);
    });
  };

  const selectInputCurrency = (nextCurrency: string) => {
    fireEvent.change(screen.getByTestId("input-currency-select"), { target: { value: nextCurrency } });
  };

  const selectOutputCurrency = (nextCurrency: string) => {
    fireEvent.change(screen.getByTestId("output-currency-select"), { target: { value: nextCurrency } });
  };

  const toggleCurrency = async () => {
    fireEvent.click(screen.getByRole("img"));
  };

  const selectOutputCurrencyFromEquivalence = async (nextCurrency: string) => {
    fireEvent.change(screen.getByTestId("output-pocket-select"), { target: { value: nextCurrency } });
  };

  const submit = () => {
    fireEvent.click(screen.getByRole("button"));
  };

  test("updates rate every 10 seconds and update the output", async () => {
    server.use(
      rest.get("/exchange", (req, res, ctx) => {
        return res(
          ctx.json({
            rates: {
              EUR: 1.23,
              USD: 4.56,
              GBP: 1,
            },
          })
        );
      })
    );

    render(<ForeignExchange {...initialState()} />);
    expect(screen.queryByText("£ 1.00 = € 1.00")).not.toBeNull();
    updateInputAmount(1);
    await advanceIntervalBy(10001);
    await waitFor(() => expect(screen.queryByText("£ 1.00 = € 1.23")).not.toBeNull());

    server.use(
      rest.get("/exchange", (req, res, ctx) => {
        return res(
          ctx.json({
            rates: {
              EUR: 4.56,
              USD: 4.56,
              GBP: 1,
            },
          })
        );
      })
    );
    await advanceIntervalBy(10001);
    await waitFor(() => expect(screen.queryByText("£ 1.00 = € 4.56")).not.toBeNull());
  });

  test("update ouput on select currency change", async () => {
    render(<ForeignExchange {...{ ...initialState(), rates: { USD: 1, EUR: 2, GBP: 1 } }} />);
    updateInputAmount(2);
    expect(screen.queryByText("€ 4.00")).not.toBeNull();

    server.use(
      rest.get("/exchange", (req, res, ctx) => {
        return res(
          ctx.json({
            rates: {
              EUR: 0.8,
              USD: 1,
              GBP: 0.9,
            },
          })
        );
      })
    );

    selectInputCurrency("USD");
    await waitFor(() => expect(screen.queryByText("$ 1.00 = £ 0.90")).not.toBeNull());
    updateInputAmount(1);

    selectOutputCurrency("GBP");
    await waitFor(() => expect(screen.queryByText("Balance £ 1.00")).not.toBeNull());

    selectOutputCurrency("EUR");
    await waitFor(() => expect(screen.queryByText("Balance € 1.00")).not.toBeNull());
  });

  test("toggle currency input and output", async () => {
    render(<ForeignExchange {...initialState()} />);
    expect(screen.queryByText("£ 1.00 = € 1.00")).not.toBeNull();

    server.use(
      rest.get("/exchange", (req, res, ctx) => {
        return res(
          ctx.json({
            rates: {
              EUR: 1,
              USD: 1.25,
              GBP: 0.9,
            },
          })
        );
      })
    );

    toggleCurrency();

    await waitFor(() => expect(screen.queryByText("€ 1.00 = £ 0.90")).not.toBeNull());
  });

  test("change output pocket from equivalence", async () => {
    render(<ForeignExchange {...initialState()} />);

    selectOutputCurrencyFromEquivalence("EUR");
    await waitFor(() => expect(screen.queryByText("Balance € 1.00")).not.toBeNull());
  });

  test("disable exchange button for out of bound amount", () => {
    render(<ForeignExchange {...initialState()} />);
    updateInputAmount(10);
    expect(screen.getByRole("button")).toBeDisabled();

    updateInputAmount(1);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("exchange input amount to output amount and change input if balance is less than current input", () => {
    render(<ForeignExchange {...initialState()} />);

    updateInputAmount(0.2);
    submit();
    expect(screen.queryByText("Balance £ 0.80")).not.toBeNull();

    updateInputAmount(0.7);
    submit();
    expect(screen.queryByText("Balance £ 0.10")).not.toBeNull();

    updateInputAmount(0.1);
    submit();
    expect(screen.queryByText("Balance £ 0.00")).not.toBeNull();

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
