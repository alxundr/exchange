import each from "jest-each";
import { getAmount } from "./amount";
import { AllowedCurrencies } from "./currency";

describe("Amount domain", () => {
  each`
    value         | text
    ${1234.12345} | ${"€ 1,234.12"}
    ${1.999}      | ${"€ 2.00"}
    ${null}       | ${"€ 0.00"}
    ${undefined}  | ${"€ 0.00"}
  `.test("transforms value to amount with currency symbol and 2 fraction digits", ({ value, text }) => {
    expect(getAmount(value, AllowedCurrencies.EUR).toString()).toEqual(text);
  });

  each`
    value         | rate       | targetCurrency   | result
    ${1234.12345} | ${0.9}     | ${"EUR"}         | ${"€ 1,110.71"}
    ${1.999}      | ${0.75}    | ${"GBP"}         | ${"£ 1.50"}
    ${null}       | ${0.9}     | ${"GBP"}         | ${"£ 0.00"}
    ${undefined}  | ${0.75}    | ${"EUR"}         | ${"€ 0.00"}
  `.test("transforms value to exchange", ({ value, rate, targetCurrency, result }) => {
    expect(getAmount(value).toExchange(rate, targetCurrency).toString()).toEqual(result);
  });
});
