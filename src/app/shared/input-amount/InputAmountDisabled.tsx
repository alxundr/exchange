import React from 'react';
import { Amount } from '../../../domain/amount';
import './InputAmount.scss';

interface InputAmountProps {
  amount: Amount;
}

const InputAmountDisabled: React.FC<InputAmountProps> = ({ amount }) => {
  return (
    <span>{amount.value > 0 && (<div className="input-amount-field">{amount.value}</div>)}</span>
  )
}

export default InputAmountDisabled;
