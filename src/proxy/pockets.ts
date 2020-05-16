import { Amount } from '../domain/amount'; 

export const getPockets = async (): Promise<Amount[]> => {
  const responsePockets = await fetch ('./data/input.json');
  const { pockets } = await responsePockets.json();
  return pockets.map(({ amount, currency }: any) => new Amount(amount, currency));
}