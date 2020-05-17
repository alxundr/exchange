import React, { useEffect, useState } from "react";

import { getAmount } from "../domain/amount";
import { State } from "../store/state";
import { getRatesByCurrency } from "../proxy/rates";
import { getPockets } from "../proxy/pockets";
import ForeignExchange from "./foreign-exchange/ForeignExchange";
import "./App.scss";

const App: React.FC = () => {
  const [initialState, setInitialState] = useState<State>();

  useEffect(() => {
    const fetchData = async () => {
      const pockets = await getPockets();
      const [inputPocket, outputPocket] = pockets;
      const rates = await getRatesByCurrency(inputPocket.currency.id);
      const input = getAmount(0, inputPocket.currency.id);
      const output = getAmount(0, outputPocket.currency.id);
      setInitialState({
        pockets,
        input,
        output,
        rates,
      });
    };
    if (!initialState) {
      fetchData();
    }
  }, [setInitialState, initialState]);

  if (!initialState) {
    return <div>loading...</div>;
  }

  return (
    <div className="App">
      <ForeignExchange {...initialState} />
    </div>
  );
};

export default App;
