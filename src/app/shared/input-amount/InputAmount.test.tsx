import React from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";
import InputAmount from "./InputAmount";
import { Amount } from "../../../domain/amount";

describe("InputAmount Component", () => {
  let inputAmount: ReactWrapper;

  afterEach(() => {
    inputAmount.unmount();
  });

  const updateAmount = (value: any) => {
    act(() => {
      inputAmount
        .find("input.input-amount-field")
        .at(0)
        .props()
        .onChange({ currentTarget: { value } } as any);
    });
  };

  test("sets value from input change", () => {
    let value = 0;
    const setValue = (newValue: number) => {
      value = newValue;
    };
    inputAmount = mount(<InputAmount amount={new Amount(value)} setValue={setValue} />);
    updateAmount(-1);
    expect(value).toEqual(-1);
  });

  test("sets value to zero in case amount is not a valid number", () => {
    let value = 1;
    const setValue = (newValue: number) => {
      value = newValue;
    };
    inputAmount = mount(<InputAmount amount={new Amount(value)} setValue={setValue} />);
    updateAmount("");
    expect(value).toEqual(0);
  });
});
