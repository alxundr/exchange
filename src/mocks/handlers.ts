import { rest } from "msw";

export const handlers = [
  rest.get("/pockets", (req, res, ctx) => {
    return res(
      ctx.json({
        pockets: [
          {
            amount: 1000,
            currency: "GBP",
          },
          {
            amount: 2000,
            currency: "EUR",
          },
          {
            amount: 3000,
            currency: "USD",
          },
        ],
      })
    );
  }),
  rest.get("/exchange", (req, res, ctx) => {
    return res(
      ctx.json({
        base: "GBP",
        rates: {
          EUR: 1.2,
          USD: 1.31,
          GBP: 1.27,
        },
      })
    );
  }),
];
