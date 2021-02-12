import React from "react";
import { mount, ReactWrapper } from "enzyme";
import "whatwg-fetch";
import fetchMock from "fetch-mock";
import { act } from "react-dom/test-utils";

import { getAmount } from "../../domain/amount";
import { AllowedCurrencies } from "../../domain/currency";
import { State } from "../../store/state";
import ForeignExchange from "./ForeignExchange";
import InputAmount from "../shared/components/InputAmount";
import Text from "../shared/components/Text";
import { OPEN_EXCHANGE_ENDPOINT } from "../../proxy/rates";
import { InputAmountDisabled } from "../shared/components/InputAmount";

describe("ForeignExchange", () => {
  const initialState = (): State => ({
    pockets: [getAmount(1), getAmount(1, AllowedCurrencies.EUR), getAmount(1, AllowedCurrencies.USD)],
    rates: {
      USD: 1,
      EUR: 1,
      GBP: 1,
    },
    input: getAmount(0),
    output: getAmount(0, AllowedCurrencies.EUR),
  });
  let component: ReactWrapper;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    global["fetch"] = fetch;
  });

  afterEach(() => {
    component.unmount();
    jest.clearAllMocks();
    jest.clearAllTimers();
    fetchMock.restore();
  });

  const updateInputAmount = (amount: number) => {
    act(() => {
      component.find(InputAmount).prop("onChange")(amount);
    });
  };

  const advanceIntervalBy = async (time: number) => {
    await act(async () => {
      jest.advanceTimersByTime(time);
    });
  };

  const selectOutputCurrencyFromTop = (currency: string) => {
    act(() => {
      component
        .find("select")
        .at(0)
        .props()
        .onChange({ target: { value: currency } } as any);
    });
  };

  const toggleCurrency = async () => {
    await act(async () => {
      component.find("img.toggle-arrows").props().onClick(null);
    });
  };

  const selectInputPocket = async (currency: string) => {
    await act(async () => {
      component
        .find("select.large")
        .at(0)
        .props()
        .onChange({ target: { value: currency } } as any);
    });
  };
  const selectOutputCurrencyFromBottom = (currency: string) => {
    act(() => {
      component
        .find("select.large")
        .at(1)
        .props()
        .onChange({ target: { value: currency } } as any);
    });
  };

  const submit = () => {
    act(() => {
      component.find("button").props().onClick(null);
    });
  };

  test("updates rate every 10 seconds and update the output", async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        EUR: 1.23,
        USD: 4.56,
        GBP: 1,
      },
    });

    component = mount(<ForeignExchange {...initialState()} />);
    expect(component.find("option").at(0).text()).toContain("£ 1.00 = € 1.00");

    await advanceIntervalBy(10001);
    updateInputAmount(1);
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 1.23");

    fetchMock.restore();
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        EUR: 4.56,
        USD: 4.56,
        GBP: 1,
      },
    });
    await advanceIntervalBy(10001);
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 4.56");
  });

  test("update ouput on select currency change", () => {
    component = mount(<ForeignExchange {...{ ...initialState(), rates: { USD: 1, EUR: 2, GBP: 1 } }} />);
    updateInputAmount(1);
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 2.00");

    selectOutputCurrencyFromTop("USD");
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("$ 1.00");

    selectOutputCurrencyFromBottom("EUR");
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 2.00");
  });

  test("toggle currency input and output", async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=EUR`, {
      rates: {
        EUR: 4.56,
        USD: 4.56,
        GBP: 1,
      },
    });

    component = mount(<ForeignExchange {...initialState()} />);
    expect(initialState().input.currency.id).toEqual("GBP");
    expect(initialState().output.currency.id).toEqual("EUR");
    expect(component.find(InputAmount).at(0).prop("amount").isSame(initialState().input)).toEqual(true);
    expect(component.find(InputAmountDisabled).prop("amount").isSame(initialState().output)).toEqual(true);

    await toggleCurrency();
    component.update();
    expect(component.find(InputAmount).at(0).prop("amount").isSame(initialState().output)).toEqual(true);
    expect(component.find(InputAmountDisabled).prop("amount").isSame(initialState().input)).toEqual(true);
  });

  test("change input pocket", async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=EUR`, {
      rates: {
        EUR: 1,
        USD: 1.08,
        GBP: 0.89,
      },
    });
    component = mount(<ForeignExchange {...initialState()} />);
    expect(initialState().pockets[0].currency.id).toEqual("GBP");
    expect(initialState().pockets[1].currency.id).toEqual("EUR");

    await selectInputPocket(initialState().pockets[1].currency.id);
    component.update();
    expect(component.find(InputAmount).at(0).prop("amount").value).toEqual(0);
    expect(component.find(InputAmount).at(0).prop("amount").currency.id).toEqual("EUR");
  });

  test("disable exchange button", () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        EUR: 4.56,
        USD: 4.56,
        GBP: 1,
      },
    });
    component = mount(<ForeignExchange {...initialState()} />);
    updateInputAmount(10);
    component.update();
    expect(component.find("button").props().disabled).toBeTruthy();

    expect(initialState().pockets[0].value).toEqual(1);

    updateInputAmount(1);
    component.update();
    expect(component.find("button").props().disabled).toBeFalsy();
  });

  test("exchange input amount to output amount and change input if balance is less than current input", () => {
    component = mount(<ForeignExchange {...initialState()} />);
    expect(component.find(Text).at(0).text()).toContain("Balance £ 1.00");

    updateInputAmount(0.2);
    component.update();
    expect(component.find("button").props().disabled).toBeFalsy();

    submit();
    component.update();
    expect(component.find(Text).at(0).text()).toContain("Balance £ 0.80");

    updateInputAmount(0.7);
    component.update();
    expect(component.find("button").props().disabled).toBeFalsy();

    submit();
    component.update();
    expect(component.find(Text).at(0).text()).toContain("Balance £ 0.10");
    expect(component.find(InputAmount).prop("amount").value).toEqual(0.1);
    expect(component.find(InputAmountDisabled).prop("amount").value).toEqual(0.1);

    updateInputAmount(0.1);
    component.update();
    expect(component.find("button").props().disabled).toBeFalsy();

    submit();
    component.update();
    expect(component.find(Text).at(0).text()).toContain("Balance £ 0.00");
    expect(component.find(InputAmount).prop("amount").value).toEqual(0);
    expect(component.find(InputAmountDisabled).prop("amount").value).toEqual(0);
  });
});
