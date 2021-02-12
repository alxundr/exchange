import { Amount } from "domain/amount";
import { Rate } from "domain/rate";

export interface State {
  pockets: Amount[];
  input: Amount;
  output: Amount;
  rates: Rate;
}
