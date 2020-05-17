import isEqual from "lodash.isequal";
import { Amount } from "../domain/amount";
import { AllowedCurrencies } from "../domain/currency";
import { Rate } from "../domain/rate";
import { Action, Payload } from "./actions";
import { State } from "./state";

type ReducerProps = {
  type: Action;
  payload: Payload;
};

export const reducer = (state: State, { type, payload }: ReducerProps): State => {
  switch (type) {
    case Action.SetInputAmount: {
      const input = new Amount(payload.amount as number, state.input.currency.id);
      return {
        ...state,
        input,
        output: input.toExchange(state.rates[state.output.currency.id], state.output.currency.id),
      };
    }
    case Action.ChangeInputPocket: {
      const input = new Amount(0, payload.currency);
      return {
        ...state,
        input,
        output: new Amount(0, state.output.currency.id),
      };
    }
    case Action.ChangeOutputCurrency: {
      return {
        ...state,
        output: state.input.toExchange(
          state.rates[payload.currency as AllowedCurrencies],
          payload.currency as AllowedCurrencies
        ),
      };
    }
    case Action.UpdateRates:
      /* istanbul ignore if */
      if (isEqual(payload.rates, state.rates)) {
        return state;
      }
      return {
        ...state,
        rates: payload.rates as Rate,
        output: state.input.toExchange((payload.rates as Rate)[state.output.currency.id], state.output.currency.id),
      };
    case Action.Toggle: {
      const input = new Amount(0, payload.inputCurrency);
      const output = new Amount(0, payload.outputCurrency);
      return {
        ...state,
        input,
        output,
      };
    }
    case Action.Exchange: {
      const { inputAmount, outputAmount } = payload;
      const pockets = state.pockets.map((pocket) => {
        if (pocket.currency.id === (inputAmount as Amount).currency.id) {
          return new Amount(pocket.value - (inputAmount as Amount).value, (inputAmount as Amount).currency.id);
        }
        if (pocket.currency.id === (outputAmount as Amount).currency.id) {
          return new Amount(pocket.value + (outputAmount as Amount).value, (outputAmount as Amount).currency.id);
        }
        return pocket;
      });
      return {
        ...state,
        pockets,
      };
    }
    /* istanbul ignore next */
    default:
      return state;
  }
};
