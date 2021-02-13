import React from "react";
import Card from "./Card";
import { render } from "@testing-library/react";

describe("Card", () => {
  test("matches snapshot", () => {
    const card = render(<Card style={{ color: "white", backgroundColor: "black" }}>Luke, I am your father!</Card>);
    expect(card.container).toMatchSnapshot();
  });
});
