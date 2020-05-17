import { Amount, getAmount } from "../domain/amount";
import { AllowedCurrencies } from "../domain/currency";

type Pocket = {
  amount: number;
  currency: AllowedCurrencies;
};

export const getPockets = async (): Promise<Amount[]> => {
  const responsePockets = await fetch("./data/input.json");
  const { pockets } = (await responsePockets.json()) as { pockets: Pocket[] };
  return pockets.map(({ amount, currency }) => getAmount(amount, currency));
};
