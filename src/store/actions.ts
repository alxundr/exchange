import { AllowedCurrencies } from "src/domain/currency";
import { Amount } from "src/domain/amount";
import { Rate } from "src/domain/rate";

export enum Action {
  SetInputAmount,
  ChangeOutputCurrency,
  ChangeInputPocket,
  UpdateRates,
  Toggle,
  Exchange,
}

export type Payload = {
  amount?: number;
  currency?: AllowedCurrencies;
  rates?: Rate;
  inputCurrency?: AllowedCurrencies;
  outputCurrency?: AllowedCurrencies;
  inputAmount?: Amount;
  outputAmount?: Amount;
};

const setInputAmount = (payload: number) => ({
  type: Action.SetInputAmount,
  payload: {
    amount: payload,
  },
});

const changeOutputCurrency = (payload: AllowedCurrencies) => ({
  type: Action.ChangeOutputCurrency,
  payload: {
    currency: payload,
  },
});

const changeInputPocket = (payload: AllowedCurrencies) => ({
  type: Action.ChangeInputPocket,
  payload: {
    currency: payload,
  },
});

const updateRates = (payload: { [currency in AllowedCurrencies]: number }) => ({
  type: Action.UpdateRates,
  payload: {
    rates: payload,
  },
});

const toggle = ({ input, output }: { [field in "input" | "output"]: AllowedCurrencies }) => ({
  type: Action.Toggle,
  payload: {
    inputCurrency: input,
    outputCurrency: output,
  },
});

const exchange = ({ input, output }: { [field in "input" | "output"]: Amount }) => ({
  type: Action.Exchange,
  payload: {
    inputAmount: input,
    outputAmount: output,
  },
});

export const actionCreators = {
  setInputAmount,
  changeOutputCurrency,
  changeInputPocket,
  updateRates,
  toggle,
  exchange,
};
