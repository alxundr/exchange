import each from 'jest-each';
import { Amount } from './amount';

describe('Amount Component', () => {
  each`
    value         | text
    ${1234.12345} | ${'€ 1,234.12'}
    ${1.999}      | ${'€ 2.00'}
    ${null}       | ${'€ 0.00'}
    ${undefined}  | ${'€ 0.00'}
  `.
  test('transforms value to amount with currency symbol and 2 fraction digits', ({ value, text }) => {
    expect(new Amount(value, 'EUR').toString()).toEqual(text);
  });

  each`
    value         | rate       | targetCurrency   | result
    ${1234.12345} | ${0.9}     | ${'EUR'}         | ${'€ 1,110.71'}
    ${1.999}      | ${0.75}    | ${'GBP'}         | ${'£ 1.50'}
    ${null}       | ${0.9}     | ${'GBP'}         | ${'£ 0.00'}
    ${undefined}  | ${0.75}    | ${'EUR'}         | ${'€ 0.00'}
  `.
  test('transforms value to exchange', ({ value, rate, targetCurrency, result }) => {
    expect((new Amount(value).toExchange(rate, targetCurrency)).toString()).toEqual(result);
  });

  test('initiates amount with USD currency in case of invalid currency id', () => {
    expect(new Amount(1, 'ABC').toString()).toEqual('$ 1.00');
  });
});
