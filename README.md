# Exchange

## Before start

You need NodeJS (v10.13.5 would be advisable, specially for the node-sass dependency), and `npm` or `yarn` to be installed.

`yarn` or `npm i` will install all dependencies.

## To start

In the project directory, you can run:

### `yarn start` or `npm start`

Runs the app in the development mode.
A browser window will open at [http://localhost:3000](http://localhost:3000).

### `yarn test` or `npm test`

This script launches the test runner and also shows the coverage of the current files.

### `yarn serve` or `npm run serve`

Will build a production ready version of the app and run the app in production mode.
You can find the app running at [http://localhost:3000](http://localhost:3000).

## Input file

The input file with the information of the pockets is located at `public/data/input.json`

```json
{
  "pockets": [
    {
      "amount": 1000,
      "currency": "GBP"
    },
    {
      "amount": 2000,
      "currency": "EUR"
    },
    {
      "amount": 3000,
      "currency": "USD"
    }
  ]
}
```

## Using Open Exchange

Replace your `.env` file with your **app_id**
```
REACT_APP_EXCHANGE_ID=someAppIdHere
```

## Mocking api

Additionally a mocked exchange json input is located at `public/data/exchange.json`, to use it set `process.env.REACT_APP_USE_EXCHANGE_MOCK` to `true`.
