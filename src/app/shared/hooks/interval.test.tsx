import React, { useState } from "react";
import { useInterval } from "./interval";
import { act, render, screen } from "@testing-library/react";

const IntervalComponentTest = () => {
  const [counter, setCounter] = useState(0);

  useInterval(() => {
    setCounter((c) => c + 1);
  }, 500);

  return <div className="message">{counter}</div>;
};

describe("useInterval", () => {
  test("updates counter every 500ms", () => {
    expect.assertions(3);

    const dummy = render(<IntervalComponentTest />);

    expect(screen.queryByText(/0/)).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(screen.queryByText(/1/)).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByText(/2/)).not.toBeNull();
  });
});
