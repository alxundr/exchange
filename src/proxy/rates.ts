export const OPEN_EXCHANGE_ENDPOINT = `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_EXCHANGE_ID}`;

const endpoint = (currency: string) => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_USE_EXCHANGE_MOCK) {
    return './data/exchange.json';
  }
  return `${OPEN_EXCHANGE_ENDPOINT}&base=${currency}`;
}

export const getRatesByCurrency = async (currency: string) => {
  const responseRates = await fetch(endpoint(currency));
  const { rates } = await responseRates.json();
  return rates;
}