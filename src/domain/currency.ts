export enum AllowedCurrencies {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export interface Currency {
  symbol: string;
  id: AllowedCurrencies;
}

const currencySymbols = {
  [AllowedCurrencies.USD]: "$",
  [AllowedCurrencies.EUR]: "€",
  [AllowedCurrencies.GBP]: "£",
};

export const getCurrency = (id: AllowedCurrencies): Currency => ({
  id,
  symbol: currencySymbols[id],
});
