import isEqual from "lodash.isequal";
import { Rate } from "../domain/rate";
import { getCurrency } from "../domain/currency";
import { ActionTypes, Action } from "./actions";
import { State } from "./state";
import produce, { Draft } from "immer";

export const foreignExchangeReducer = produce((draft: Draft<State>, { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.SetInputAmount: {
      draft.input.updateValue(payload.amount);
      draft.output.updateValue(draft.rates[draft.output.currency.id] * draft.input.value);
      break;
    }
    case ActionTypes.ChangeInputPocket: {
      draft.input.reset(payload.currency);
      draft.output.reset();
      break;
    }
    case ActionTypes.ChangeOutputCurrency: {
      draft.output.updateValue(draft.rates[payload.currency] * draft.input.value);
      draft.output.currency = getCurrency(payload.currency);
      break;
    }
    case ActionTypes.UpdateRates:
      /* istanbul ignore else */
      if (!isEqual(payload.rates, draft.rates)) {
        const rates = payload.rates as Rate;
        draft.rates = rates;
        draft.output.updateValue(rates[draft.output.currency.id] * draft.input.value);
      }
      break;
    case ActionTypes.Toggle: {
      draft.input.reset(payload.inputCurrency);
      draft.output.reset(payload.outputCurrency);
      break;
    }
    case ActionTypes.Exchange: {
      const { inputAmount, outputAmount } = payload;
      draft.pockets.forEach((pocket, index) => {
        if (pocket.currency.id === inputAmount.currency.id) {
          const newValue = pocket.value - inputAmount.value;
          pocket.updateValue(newValue);
          if (newValue <= inputAmount.value) {
            draft.input.updateValue(newValue);
            draft.output.updateValue(draft.rates[draft.output.currency.id] * draft.input.value);
          }
        }
        if (pocket.currency.id === outputAmount.currency.id) {
          pocket.updateValue(pocket.value + outputAmount.value);
        }
      });
      break;
    }
  }
});
