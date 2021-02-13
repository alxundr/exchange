import React, { useEffect, useRef, useState } from "react";
import { Amount, getFixedValue } from "domain/amount";
import styles from "./InputAmount.module.scss";

interface InputAmountProps {
  amount: Amount;
  alt: string;
  focused?: boolean;
  onChange: (value: number) => void;
}

const InputAmount: React.FC<InputAmountProps> = ({ amount, onChange, alt, focused = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentInputValue, setCurrentInputValue] = useState(amount.value);

  useEffect(() => {
    if (inputRef.current && focused) {
      inputRef.current.focus();
    }
  }, [focused]);

  const convertToNumber = (event: any) => {
    const _amount = event.target.value;
    let newValue;
    if (!_amount || !/^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/.test(_amount)) {
      newValue = 0;
    } else {
      newValue = getFixedValue(+_amount);
    }
    setCurrentInputValue(newValue);
    onChange(newValue);
  };

  return (
    <input
      data-testid="input-amount"
      ref={inputRef}
      className={styles["input-amount-field"]}
      type="number"
      alt={alt}
      value={currentInputValue}
      onChange={convertToNumber}
    />
  );
};

export default InputAmount;
