import { AllowedCurrencies } from "./currency";

export type Rate = {
  [currency in AllowedCurrencies]: number;
};
