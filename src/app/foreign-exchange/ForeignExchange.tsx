import React, { useEffect, useReducer, useState, useMemo, useCallback } from "react";
import { reducer } from "../../store/reducers";
import { actionCreators } from "../../store/actions";
import { Amount } from "../../domain/amount";
import { State } from "../../store/state";
import { getRatesByCurrency } from "../../proxy/rates";
import Card, { CardColor } from "../shared/card/Card";
import Text, { TextSize, TextType } from "../shared/text/Text";
import InputAmount from "../shared/input-amount/InputAmount";
import InputAmountDisabled from "../shared/input-amount/InputAmountDisabled";
import { useInterval } from "../shared/hooks/interval";

import ToggleArrows from "./toggle-arrows.svg";
import styles from "./ForeignExchange.module.scss";
import { AllowedCurrencies } from "src/domain/currency";

const ForeignExchange: React.FC<State> = (props: State) => {
  const [state, dispatch] = useReducer(reducer, props);
  const [disabled, setDisabled] = useState<boolean>(true);
  const singleInput = new Amount(1, state.input.currency.id);
  const singleOutput = new Amount(1, state.output.currency.id);

  const currentPocketAmount = useMemo(() => {
    return (state.pockets.find((pocket) => pocket.currency.id === state.input.currency.id) as Amount).value;
  }, [state.pockets, state.input.currency]);

  useEffect(() => {
    const inputValue = state.input.value;
    setDisabled(inputValue <= 0 || inputValue > currentPocketAmount);
  }, [state.input.value, setDisabled, currentPocketAmount]);

  const updateRates = async (currency: AllowedCurrencies) => {
    dispatch(actionCreators.updateRates(await getRatesByCurrency(currency)));
  };

  useInterval(async () => {
    await updateRates(state.input.currency.id);
  }, 10000);

  const exchangeOptions = useCallback(
    (pocket: Amount) => {
      return `${singleInput.toString()} = ${singleInput
        .toExchange(state.rates[pocket.currency.id], pocket.currency.id)
        .toString()}`;
    },
    [state.rates, singleInput]
  );

  const currencyOptions = useCallback(
    (currentCurrency: string) =>
      state.pockets
        .filter(({ currency }) => currency.id !== currentCurrency)
        .map(({ currency }) => (
          <option value={currency.id} key={currency.id}>
            {currency.id}
          </option>
        )),
    [state.pockets]
  );

  const getPocket = (currency: AllowedCurrencies): Amount => {
    return state.pockets.find((pocket) => pocket.currency.id === currency) as Amount;
  };

  const handleOutputSelectChange = (event: any) => {
    dispatch(actionCreators.changeOutputCurrency(event.target.value));
  };

  const handleInputSelectChange = async (event: any) => {
    const currency = event.target.value;
    await updateRates(currency);
    dispatch(actionCreators.changeInputPocket(currency));
  };

  const toggle = async () => {
    const { input, output } = state;
    await updateRates(output.currency.id);
    dispatch(
      actionCreators.toggle({
        input: output.currency.id,
        output: input.currency.id,
      })
    );
  };

  const exchange = () => {
    dispatch(
      actionCreators.exchange({
        input: state.input,
        output: state.output,
      })
    );
  };

  return (
    <React.Fragment>
      <Card>
        <select onChange={handleOutputSelectChange} value={state.output.currency.id}>
          {state.pockets
            .filter(({ currency }) => currency.id !== state.input.currency.id)
            .map((pocket) => (
              <option key={pocket.currency.id} value={pocket.currency.id}>
                {exchangeOptions(pocket)}
              </option>
            ))}
        </select>
        <div className="space-between">
          <select className="large" value={state.input.currency.id} onChange={handleInputSelectChange}>
            {currencyOptions(state.output.currency.id)}
          </select>
          <InputAmount
            setValue={(value: number) => dispatch(actionCreators.setInputAmount(value))}
            amount={state.input}
          />
        </div>
        <Text size={TextSize.Small} type={TextType.Secondary}>
          Balance {getPocket(state.input.currency.id).toString()}
        </Text>
      </Card>
      <Card color={CardColor.Dark}>
        <img className={styles["toggle-arrows"]} src={ToggleArrows} alt="toggle" onClick={toggle} />
        <div className="space-between">
          <select className="large" value={state.output.currency.id} onChange={handleOutputSelectChange}>
            {currencyOptions(state.input.currency.id)}
          </select>
          <InputAmountDisabled amount={state.output} />
        </div>
        <div className="space-between">
          <Text size={TextSize.Small} type={TextType.Secondary}>
            Balance {getPocket(state.output.currency.id).toString()}
          </Text>
          <Text>
            {singleOutput.toString()} ={" "}
            {singleOutput.toExchange(1 / state.rates[state.output.currency.id], state.input.currency.id).toString()}
          </Text>
        </div>
        <button type="button" style={{ margin: "2rem 1rem 0" }} onClick={exchange} disabled={disabled}>
          Exchange
        </button>
      </Card>
    </React.Fragment>
  );
};

export default ForeignExchange;
