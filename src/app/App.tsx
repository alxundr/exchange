import React, { useEffect, useState } from 'react';

import { Amount } from '../domain/amount';
import OPEN_EXCHANGE_ENDPOINT from '../domain/open-exchange';
import ForeignExchange from './foreign-exchange/ForeignExchange';
import './App.scss';

const App: React.FC = () => {
  const [initialState, setInitialState] = useState();
  const [isFetchComplete, setIsFetchComplete] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const responsePockets = await fetch ('./data/input.json');
      const { pockets } = await responsePockets.json();
      const _pockets = pockets.map(({ amount, currency }: any) => new Amount(amount, currency));

      const responseRates = await fetch(`${OPEN_EXCHANGE_ENDPOINT}&base=${pockets[0].currency}`);
      const { rates } = await responseRates.json();
      const input = new Amount(0, pockets[0].currency);
      const output = new Amount(0, pockets[1].currency);
      setInitialState({
        pockets: _pockets,
        input,
        output,
        rates,
      });
      setIsFetchComplete(true);
    }
    if (!isFetchComplete) {
      fetchData();
    }
  }, [setInitialState, isFetchComplete, setIsFetchComplete]);

  if (!isFetchComplete) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      <ForeignExchange {...initialState} />
    </div>
  );
}

export default App;
