import { CURRENCIES, Currency, AllowedCurrencies } from "./currency";

export class Amount {
  static getValue(amount: number): number {
    return +amount.toFixed(2);
  }

  get value(): number {
    return Amount.getValue(this._value);
  }

  get currency(): Currency {
    return this._currency;
  }

  private _value: number;
  private _currency: Currency;

  constructor(value: number, currencyId?: AllowedCurrencies) {
    this._value = value || 0;
    this._currency = CURRENCIES.find(({ id }) => id === currencyId) || CURRENCIES[0];
  }

  toString(): string {
    return `${this.currency.symbol} ${this.value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  toExchange(rate: number, currencyId: AllowedCurrencies): Amount {
    return new Amount(rate * this.value, currencyId);
  }
}
