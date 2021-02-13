import React from "react";
import { useQuery } from "react-query";

import { getAmount } from "../domain/amount";
import { State } from "../store/state";
import { getRatesByCurrency } from "../proxy/rates";
import { getPockets } from "../proxy/pockets";
import ForeignExchange from "./foreign-exchange/ForeignExchange";
import styles from "./App.module.scss";

const App: React.FC = () => {
  const { data: initialState } = useQuery<State>("initialState", async () => {
    const pockets = await getPockets();
    const [inputPocket, outputPocket] = pockets;
    const input = getAmount(0, inputPocket?.currency.id);
    const output = getAmount(0, outputPocket?.currency.id);
    const rates = await getRatesByCurrency(inputPocket?.currency.id);
    return {
      pockets,
      input,
      output,
      rates,
    };
  });

  if (!initialState) {
    return <div>loading...</div>;
  }

  return (
    <div className={styles.App}>
      <ForeignExchange {...initialState} />
    </div>
  );
};

export default App;
