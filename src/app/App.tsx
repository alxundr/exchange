import React, { useEffect, useState } from "react";

import { Amount } from "../domain/amount";
import { State } from "../domain/state";
import { getRatesByCurrency } from "../proxy/rates";
import { getPockets } from "../proxy/pockets";
import ForeignExchange from "./foreign-exchange/ForeignExchange";
import "./App.scss";

const App: React.FC = () => {
  const [initialState, setInitialState] = useState<State>();
  const [isFetchComplete, setIsFetchComplete] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const [inputPocket, outputPocket] = await getPockets();
      const rates = await getRatesByCurrency(inputPocket.currency.id);
      const input = new Amount(0, inputPocket.currency.id);
      const output = new Amount(0, outputPocket.currency.id);
      setInitialState({
        pockets: [inputPocket, outputPocket],
        input,
        output,
        rates,
      });
      setIsFetchComplete(true);
    };
    if (!isFetchComplete) {
      fetchData();
    }
  }, [setInitialState, isFetchComplete, setIsFetchComplete]);

  if (!isFetchComplete || !initialState) {
    return <div>loading...</div>;
  }

  return (
    <div className="App">
      <ForeignExchange {...initialState} />
    </div>
  );
};

export default App;
