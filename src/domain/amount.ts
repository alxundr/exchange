import { getCurrency, Currency, AllowedCurrencies } from "./currency";

export interface Amount {
  value: number;
  currency: Currency;
  toString: () => string;
  toExchange: (rate: number, currencyId: AllowedCurrencies) => Amount;
  updateValue: (newValue: number) => Amount;
  reset: (currencyId?: AllowedCurrencies) => Amount;
}

export function getFixedValue(amount: number): number {
  return +amount.toFixed(2);
}

export function getAmount(value: number, currencyId: AllowedCurrencies = AllowedCurrencies.GBP): Amount {
  const currency = getCurrency(currencyId);
  const parsedValue = value || 0;

  return {
    value: getFixedValue(parsedValue),
    currency,
    toString() {
      return `${this.currency.symbol} ${this.value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    toExchange(rate: number, currencyId: AllowedCurrencies) {
      return getAmount(rate * this.value, currencyId);
    },
    updateValue(newValue: number) {
      this.value = getFixedValue(newValue);
      return this;
    },
    reset(currencyId?: AllowedCurrencies) {
      if (currencyId !== undefined) {
        this.currency = getCurrency(currencyId);
      }
      return this.updateValue(0);
    },
  };
}
