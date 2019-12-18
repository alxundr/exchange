import { Amount } from './amount';

export interface State {
  pockets: Amount[],
  input: Amount,
  output: Amount,
  rates: {
    [currency: string]: number,
  },
}
