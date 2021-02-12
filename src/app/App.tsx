import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Amount, getAmount } from "../domain/amount";
import { State } from "../store/state";
import { getRatesByCurrency } from "../proxy/rates";
import { getPockets } from "../proxy/pockets";
import ForeignExchange from "./foreign-exchange/ForeignExchange";
import styles from "./App.module.scss";

const App: React.FC = () => {
  const { data: pockets = [] } = useQuery<Amount[]>("pockets", getPockets);
  const [inputPocket, outputPocket] = pockets;
  const { data: rates } = useQuery("rates", () => getRatesByCurrency(inputPocket?.currency.id), {
    enabled: pockets.length > 1,
  });
  const [initialState, setInitialState] = useState<State>();

  useEffect(() => {
    if (rates !== undefined) {
      const input = getAmount(0, inputPocket?.currency.id);
      const output = getAmount(0, outputPocket?.currency.id);
      setInitialState({
        pockets,
        input,
        output,
        rates,
      });
    }
  }, [inputPocket, outputPocket, pockets, rates]);

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
