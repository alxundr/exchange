import React from 'react';
import { Amount } from '../../../domain/amount';
import './InputAmount.scss';

interface InputAmountProps {
  amount: Amount;
  disabled?: boolean;
  setValue?: (value: number) => void;
}

const InputAmount: React.FC<InputAmountProps> = ({ amount, setValue = () => {}, disabled = false}) => {
  const handleInput = (event: any) => {
    const _amount = event.currentTarget.value;
    if (!_amount || !/^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/.test(_amount)) {
      setValue(0);
    } else {
      setValue(Amount.getValue(+_amount));
    }
  }

  const getRenderedValue = (str: string) => {
    return str.replace(/^0+/,'');
  }

  if (disabled) {
    return (
      <span>{amount.value > 0 && (<div className="input-amount-field">{amount.value}</div>)}</span>
    )
  }

  return (
    <input
      className="input-amount-field"
      type="number"
      value={getRenderedValue(amount.value.toString())}
      onChange={handleInput}
    />
  )
}

export default InputAmount;
