import * as React from 'react';
import { mount } from 'enzyme';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import { act } from 'react-dom/test-utils'
import App from './App';
import ForeignExchange from './foreign-exchange/ForeignExchange';
import { Amount } from '../domain/amount';
import { OPEN_EXCHANGE_ENDPOINT } from '../proxy/rates';

describe('App Component', () => {
  beforeAll(() => {
    global['fetch'] = fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    fetchMock.restore();
  });

  test('creates App div', async () => {
    const app = mount(<App />);
    expect(app.find('div').at(0).text()).toContain('loading...');
  });

  test('creates ForeignExchange and pass props', async () => {
    fetchMock.mock('./data/input.json', {
      pockets: [
        {
          amount: 1,
          currency: 'GBP',
        },
        {
          amount: 2,
          currency: 'EUR',
        },
      ]
    });
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        ['EUR']: 1.23,
        ['USD']: 4.56,
      }
    });

    const app = mount(<App />);

    await act(async () => {
      app.update();
    });
    act(() => {
      app.update();
    });
    expect(app.find(ForeignExchange).at(0).props()).toEqual({
      input: new Amount(0, 'GBP'),
      output: new Amount(0, 'EUR'),
      rates: {
        EUR: 1.23,
        USD: 4.56,
      },
      pockets: [
        new Amount(1, 'GBP'),
        new Amount(2, 'EUR'),
      ],
    });
  });
});
