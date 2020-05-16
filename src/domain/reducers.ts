import { Amount } from './amount';
import { Action } from './actions';
import { State } from './state';

export const reducer = (state: State, { type, payload }: any) => {
  switch (type) {
    case Action.SetInputAmount: {
      const input = new Amount(payload, state.input.currency.id);
      return {
        ...state,
        input,
        output: input.toExchange(state.rates[state.output.currency.id], state.output.currency.id),
      }
    }
    case Action.ChangeInputPocket: {
      const input = new Amount(0, payload);
      return {
        ...state,
        input,
        output: new Amount(0, state.output.currency.id),
      }
    }
    case Action.ChangeOutputCurrency: {
      return {
        ...state,
        output: state.input.toExchange(state.rates[payload], payload),
      }
    }
    case Action.UpdateRates:
      return {
        ...state,
        rates: payload,
        output: state.input.toExchange(payload[state.output.currency.id], state.output.currency.id),
      }
    case Action.Toggle: {
      const input = new Amount(0, payload.input);
      const output = new Amount(0, payload.output);
      return {
        ...state,
        input,
        output,
      }
    }
    case Action.Exchange: {
      const { input, output } = payload;
      const pockets = state.pockets.map(pocket => {
        if (pocket.currency.id === input.currency.id) {
          return new Amount(pocket.value - input.value, input.currency.id);
        }
        if (pocket.currency.id === output.currency.id) {
          return new Amount(pocket.value + output.value, output.currency.id);
        }
        return pocket;
      })
      return {
        ...state,
        pockets,
      }
    }
    /* istanbul ignore next */
    default:      
      return state;
  }
}
