import { Amount, getAmount } from "domain/amount";
import { AllowedCurrencies } from "domain/currency";
import axios from "axios";

type Pocket = {
  amount: number;
  currency: AllowedCurrencies;
};

export const getPockets = async (): Promise<Amount[]> => {
  const { pockets } = (await (await axios.get("/pockets")).data) as { pockets: Pocket[] };
  return pockets.map(({ amount, currency }) => getAmount(amount, currency));
};
