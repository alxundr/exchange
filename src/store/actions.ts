import { AllowedCurrencies } from "domain/currency";
import { Amount } from "domain/amount";
import { Rate } from "domain/rate";

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

const toggle = ({ input, output }: { [field in "input" | "output"]: AllowedCurrencies }): Action => {
  return {
    type: ActionTypes.Toggle,
    payload: {
      inputCurrency: input,
      outputCurrency: output,
    } as Payload,
  };
};

const exchange = ({ input, output }: { [field in "input" | "output"]: Amount }): Action => ({
  type: ActionTypes.Exchange,
  payload: {
    inputAmount: input,
    outputAmount: output,
  } as Payload,
});

const bindedAction = (dispatch: Function) => (actionCreator: Function) => (...args: any[]) => {
  dispatch(actionCreator(...args));
};

const actions = {
  setInputAmount,
  changeOutputCurrency,
  changeInputPocket,
  updateRates,
  toggle,
  exchange,
};

export const createBindedActions = (dispatch: Function) => {
  return {
    setInputAmount: bindedAction(dispatch)(setInputAmount),
    changeOutputCurrency: bindedAction(dispatch)(changeOutputCurrency),
    changeInputPocket: bindedAction(dispatch)(changeInputPocket),
    updateRates: bindedAction(dispatch)(updateRates),
    toggle: bindedAction(dispatch)(toggle),
    exchange: bindedAction(dispatch)(exchange),
  };
};

export default actions;
