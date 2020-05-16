import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils'
import InputAmount from './InputAmount';
import { Amount } from '../../../domain/amount';

describe('InputAmount Component', () => {
  test('sets value from input change', () => {
    let value = 0;
    const setValue = (newValue: number) => {
      value = newValue;
    };
    const inputAmount = mount(
      <InputAmount
        amount={new Amount(value)}
        setValue={setValue}
      />);
    act(() => {
      inputAmount.find('input.input-amount-field').at(0).props().onChange({currentTarget: { value: -1}} as any);
    });
    expect(value).toEqual(-1);
  });

  test('sets value to zero in case amount is not a valid number', () => {
    let value = 1;
    const setValue = (newValue: number) => {
      value = newValue;
    };
    const inputAmount = mount(
      <InputAmount
        amount={new Amount(value)}
        setValue={setValue}
      />);
    act(() => {
      inputAmount.find('input.input-amount-field').at(0).props().onChange({currentTarget: { value: ''}} as any);
    });
    expect(value).toEqual(0);
  });
});
