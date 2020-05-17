import React from "react";
import { mount, ReactWrapper } from "enzyme";
import "whatwg-fetch";
import fetchMock from "fetch-mock";
import { act } from "react-dom/test-utils";

import { Amount } from "../../domain/amount";
import { State } from "../../store/state";
import ForeignExchange from "./ForeignExchange";
import InputAmount from "../shared/input-amount/InputAmount";
import Text from "../shared/text/Text";
import { OPEN_EXCHANGE_ENDPOINT } from "../../proxy/rates";
import InputAmountDisabled from "../shared/input-amount/InputAmountDisabled";

describe("ForeignExchange", () => {
  const initialState: State = {
    pockets: [new Amount(1, "GBP"), new Amount(1, "EUR"), new Amount(1, "USD")],
    rates: {
      USD: 1,
      EUR: 1,
    },
    input: new Amount(0, "GBP"),
    output: new Amount(0, "EUR"),
  };
  let component: ReactWrapper;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    global["fetch"] = fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    component.unmount();
  });

  afterAll(() => {
    fetchMock.restore();
  });

  const updateInputAmount = (amount: number) => {
    act(() => {
      component.find(InputAmount).prop("setValue")(amount);
    });
  };

  const advanceIntervalBy = async (time: number) => {
    await act(async () => {
      jest.advanceTimersByTime(time);
    });
  };

  const selectInputCurrency = (currency: string) => {
    act(() => {
      component
        .find("select")
        .at(0)
        .props()
        .onChange({ target: { value: "USD" } } as any);
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

  const submit = () => {
    act(() => {
      component.find("button").props().onClick(null);
    });
  };

  test("update rate every 10 seconds and update the output", async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        EUR: 1.23,
        USD: 4.56,
      },
    });

    component = mount(<ForeignExchange {...initialState} />);
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
      },
    });
    await advanceIntervalBy(10001);
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 4.56");
  });

  test("update ouput on select currency change", () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=EUR`, {
      rates: {
        EUR: 4.56,
        USD: 4.56,
      },
    });
    component = mount(<ForeignExchange {...{ ...initialState, rates: { USD: 1, EUR: 2 } }} />);
    updateInputAmount(1);
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("€ 2.00");

    selectInputCurrency("USD");
    component.update();
    expect(component.find(InputAmountDisabled).prop("amount").toString()).toEqual("$ 1.00");
  });

  test("toggle currency input and output", async () => {
    component = mount(<ForeignExchange {...initialState} />);
    expect(component.find(InputAmount).at(0).prop("amount")).toEqual(initialState.input);
    expect(component.find(InputAmountDisabled).prop("amount")).toEqual(initialState.output);

    await toggleCurrency();
    component.update();
    expect(component.find(InputAmount).at(0).prop("amount")).toEqual(initialState.output);
    expect(component.find(InputAmountDisabled).prop("amount")).toEqual(initialState.input);
  });

  test("change input pocket", async () => {
    component = mount(<ForeignExchange {...initialState} />);

    await selectInputPocket(initialState.pockets[1].currency.id);
    component.update();
    expect(component.find(InputAmount).at(0).prop("amount")).toEqual(
      new Amount(0, initialState.pockets[1].currency.id)
    );
  });

  test("disable exchange button", () => {
    component = mount(<ForeignExchange {...initialState} />);
    updateInputAmount(10);
    component.update();
    expect(component.find("button").props().disabled).toBeTruthy();

    updateInputAmount(1);
    component.update();
    expect(component.find("button").props().disabled).toBeFalsy();
  });

  test("exchange input amount to output amount", () => {
    component = mount(<ForeignExchange {...initialState} />);
    expect(component.find(Text).at(0).text()).toContain("Balance £ 1.00");

    updateInputAmount(1);
    component.update();
    submit();
    component.update();
    expect(component.find(Text).at(0).text()).toContain("Balance £ 0.00");
  });
});
