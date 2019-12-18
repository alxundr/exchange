export enum Action {
  SetInputAmount,
  ChangeOutputCurrency,
  ChangeInputPocket,
  UpdateRates,
  Toggle,
  Exchange,
}

const setInputAmount = (payload: number) => ({
  type: Action.SetInputAmount,
  payload,
});

const changeOutputCurrency = (payload: string) => ({
  type: Action.ChangeOutputCurrency,
  payload,
});

const changeInputPocket = (payload: string) => ({
  type: Action.ChangeInputPocket,
  payload,
});

const updateRates = (payload: {[currency: string]: number}) => ({
  type: Action.UpdateRates,
  payload,
});

const toggle = ({ input, output }: any) => ({
  type: Action.Toggle,
  payload: {
    input,
    output,
  }
});

const exchange = ({ input, output }: any) => ({
  type: Action.Exchange,
  payload: {
    input,
    output,
  }
})

export const actionCreators = {
  setInputAmount,
  changeOutputCurrency,
  changeInputPocket,
  updateRates,
  toggle,
  exchange,
}
