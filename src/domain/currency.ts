export enum AllowedCurrencies {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export class Currency {
  symbol: string;
  id: AllowedCurrencies;

  constructor(id: AllowedCurrencies, symbol: string) {
    this.id = id;
    this.symbol = symbol;
  }
}

export const CURRENCIES = [
  new Currency(AllowedCurrencies.USD, "$"),
  new Currency(AllowedCurrencies.EUR, "€"),
  new Currency(AllowedCurrencies.GBP, "£"),
];
