import { Rate } from "../domain/rate";
import { AllowedCurrencies } from "domain/currency";
import axios from "axios";

export const getRatesByCurrency = async (currency: AllowedCurrencies) => {
  const { rates } = (await axios.get("/exchange")).data as { rates: Rate };
  return rates;
};
