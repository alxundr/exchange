import React, { useReducer, Reducer, useEffect, useRef } from "react";
import { foreignExchangeReducer } from "store/reducers";
import { Action, createBindedActions } from "store/actions";
import { getAmount, Amount } from "domain/amount";
import { State } from "store/state";
import { getRatesByCurrency } from "proxy/rates";
import Card, { CardColor } from "../shared/components/Card";
import Text, { TextSize, TextType } from "../shared/components/Text";
import InputAmount, { InputAmountDisabled } from "../shared/components/InputAmount";
import { useInterval } from "../shared/hooks/interval";

import ToggleArrows from "assets/toggle-arrows.svg";
import styles from "./ForeignExchange.module.scss";
import { AllowedCurrencies } from "domain/currency";

const TIME_AFTER_NEXT_RATES_UPDATE = 10000;

const CurrencyOptions = ({ pockets, currentCurrency }: { pockets: Amount[]; currentCurrency: AllowedCurrencies }) => {
  return (
    <>
      {pockets
        .filter(({ currency }: Amount) => currency.id !== currentCurrency)
        .map(({ currency }: Amount) => (
          <option value={currency.id} key={currency.id}>
            {currency.id}
          </option>
        ))}
    </>
  );
};

const ForeignExchange: React.FC<State> = (props: State) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(foreignExchangeReducer, props);
  const singleInput = getAmount(1, state.input.currency.id);
  const singleOutput = getAmount(1, state.output.currency.id);
  const inputValue = state.input.value;
  const disabledExchangeButton = inputValue <= 0 || inputValue > getPocket(state.input.currency.id).value;
  const isFirstRatesRequest = useRef(true);
  const actions = createBindedActions(dispatch);

  useInterval(() => {
    updateRates(state.input.currency.id);
  }, TIME_AFTER_NEXT_RATES_UPDATE);

  useEffect(() => {
    if (!isFirstRatesRequest.current) {
      updateRates(state.input.currency.id);
    } else {
      isFirstRatesRequest.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.input.currency.id]);

  function exchangeOptions(pocket: Amount) {
    return `${singleInput.toString()} = ${singleInput
      .toExchange(state.rates[pocket.currency.id], pocket.currency.id)
      .toString()}`;
  }

  function getPocket(currency: AllowedCurrencies): Amount {
    return state.pockets.find((pocket: Amount) => pocket.currency.id === currency) as Amount;
  }

  async function updateRates(inputCurrency: AllowedCurrencies) {
    actions.updateRates(await getRatesByCurrency(inputCurrency));
  }

  function handleOutputSelectChange(event: any) {
    actions.changeOutputCurrency(event.target.value);
  }

  function handleInputSelectChange(event: any) {
    actions.changeInputPocket(event.target.value);
  }

  return (
    <>
      <Card>
        <select data-testid="output-pocket-select" onChange={handleOutputSelectChange} value={state.output.currency.id}>
          {state.pockets
            .filter(({ currency }: Amount) => currency.id !== state.input.currency.id)
            .map((pocket: Amount) => (
              <option key={pocket.currency.id} value={pocket.currency.id}>
                {exchangeOptions(pocket)}
              </option>
            ))}
        </select>
        <div className="space-between">
          <select
            data-testid="input-currency-select"
            className="large"
            value={state.input.currency.id}
            onChange={handleInputSelectChange}
          >
            <CurrencyOptions pockets={state.pockets} currentCurrency={state.output.currency.id} />
          </select>
          <InputAmount
            alt="input amount"
            onChange={actions.setInputAmount}
            amount={state.input}
            focused={state.input.value === 0}
          />
        </div>
        <Text size={TextSize.Small} type={TextType.Secondary}>
          Balance {getPocket(state.input.currency.id).toString()}
        </Text>
      </Card>
      <Card color={CardColor.Dark}>
        <img className={styles["toggle-arrows"]} src={ToggleArrows} alt="toggle" onClick={actions.toggle} />
        <div className="space-between">
          <select
            data-testid="output-currency-select"
            className="large"
            value={state.output.currency.id}
            onChange={handleOutputSelectChange}
          >
            <CurrencyOptions pockets={state.pockets} currentCurrency={state.input.currency.id} />
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
        <button
          type="button"
          style={{ margin: "2rem 1rem 0" }}
          onClick={actions.exchange}
          disabled={disabledExchangeButton}
        >
          Exchange
        </button>
      </Card>
    </>
  );
};

export default ForeignExchange;
