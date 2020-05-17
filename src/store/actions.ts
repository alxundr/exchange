import { AllowedCurrencies } from "src/domain/currency";
import { Amount } from "src/domain/amount";
import { Rate } from "src/domain/rate";

export enum ActionTypes {
  SetInputAmount,
  ChangeOutputCurrency,
  ChangeInputPocket,
  UpdateRates,
  Toggle,
  Exchange,
}

type Payload = {
  amount: number;
  currency: AllowedCurrencies;
  rates: Rate;
  inputCurrency: AllowedCurrencies;
  outputCurrency: AllowedCurrencies;
  inputAmount: Amount;
  outputAmount: Amount;
};

export type Action = {
  type: ActionTypes;
  payload: Payload;
};

const setInputAmount = (amount: number): Action => ({
  type: ActionTypes.SetInputAmount,
  payload: {
    amount,
  } as Payload,
});

const changeOutputCurrency = (currency: AllowedCurrencies): Action => ({
  type: ActionTypes.ChangeOutputCurrency,
  payload: {
    currency,
  } as Payload,
});

const changeInputPocket = (currency: AllowedCurrencies): Action => ({
  type: ActionTypes.ChangeInputPocket,
  payload: {
    currency,
  } as Payload,
});

const updateRates = (rates: { [currency in AllowedCurrencies]: number }): Action => ({
  type: ActionTypes.UpdateRates,
  payload: {
    rates,
  } as Payload,
});

const toggle = ({ input, output }: { [field in "input" | "output"]: AllowedCurrencies }): Action => ({
  type: ActionTypes.Toggle,
  payload: {
    inputCurrency: input,
    outputCurrency: output,
  } as Payload,
});

const exchange = ({ input, output }: { [field in "input" | "output"]: Amount }): Action => ({
  type: ActionTypes.Exchange,
  payload: {
    inputAmount: input,
    outputAmount: output,
  } as Payload,
});

export default {
  setInputAmount,
  changeOutputCurrency,
  changeInputPocket,
  updateRates,
  toggle,
  exchange,
};
