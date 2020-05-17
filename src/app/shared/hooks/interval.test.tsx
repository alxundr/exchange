import React, { useState } from "react";
import { mount } from "enzyme";
import { useInterval } from "./interval";
import { act } from "react-dom/test-utils";

const IntervalComponentTest = () => {
  const [counter, setCounter] = useState(0);

  useInterval(() => {
    setCounter((c) => c + 1);
  }, 500);

  return <div className="message">{counter}</div>;
};

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("updates counter every 500ms", () => {
    expect.assertions(3);

    const dummy = mount(<IntervalComponentTest />);

    expect(dummy.find("div.message").text()).toEqual("0");

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(dummy.find("div.message").text()).toEqual("1");

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(dummy.find("div.message").text()).toEqual("2");
  });
});
