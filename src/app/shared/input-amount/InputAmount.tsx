import React, { useEffect, useRef } from "react";
import { Amount, getFixedValue } from "../../../domain/amount";
import styles from "./InputAmount.module.scss";

interface InputAmountProps {
  amount: Amount;
  focused?: boolean;
  onChange: (value: number) => void;
}

const InputAmount: React.FC<InputAmountProps> = ({ amount, onChange, focused = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && focused) {
      inputRef.current.focus();
    }
  }, [focused]);

  const convertToNumber = (event: any) => {
    const _amount = event.currentTarget.value;
    if (!_amount || !/^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/.test(_amount)) {
      onChange(0);
    } else {
      onChange(getFixedValue(+_amount));
    }
  };

  return (
    <input
      ref={inputRef}
      className={styles["input-amount-field"]}
      type="number"
      value={amount.value.toString()}
      onChange={convertToNumber}
    />
  );
};

export default InputAmount;
