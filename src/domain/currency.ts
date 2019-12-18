export class Currency {
  symbol: string;
  id: string;

  constructor(id: string, symbol: string) {
    this.id = id;
    this.symbol = symbol;
  }
}

export const CURRENCIES = [
  new Currency('USD', '$'),
  new Currency('EUR', '€'),
  new Currency('GBP', '£'),
];
