import React from "react";
import InputAmount from "./InputAmount";
import { getAmount } from "../../../../domain/amount";
import { render, fireEvent, screen } from "@testing-library/react";

describe("InputAmount Component", () => {
  const updateAmount = (value: any) => {
    const input = screen.getByTestId("input-amount");
    fireEvent.change(input, { target: { value } });
  };

  test("sets value from input change", () => {
    const setValue = jest.fn();
    render(<InputAmount alt="amount" amount={getAmount(0)} onChange={setValue} />);
    updateAmount(124);
    expect(setValue).toHaveBeenCalledWith(124);
  });

  test("sets value to zero in case amount is not a valid number", () => {
    const setValue = jest.fn();
    render(<InputAmount alt="amount" amount={getAmount(1)} onChange={setValue} />);
    updateAmount("abc");
    expect(setValue).toHaveBeenCalledWith(0);
  });
});
