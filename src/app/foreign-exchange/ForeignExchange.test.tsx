import * as React from 'react';
import { mount } from 'enzyme';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import { act } from 'react-dom/test-utils'

import { Amount } from '../../domain/amount';
import { State } from '../../domain/state';
import ForeignExchange from './ForeignExchange';
import InputAmount from '../shared/input-amount/InputAmount';
import Text from '../shared/text/Text';
import OPEN_EXCHANGE_ENDPOINT from '../../domain/open-exchange';

describe('ForeignExchange', () => {
  const initialState: State = {
    pockets: [
      new Amount(1, 'GBP'),
      new Amount(1, 'EUR'),
      new Amount(1, 'USD'),
    ],
    rates: {
      USD: 1,
      EUR: 1
    },
    input: new Amount(0, 'GBP'),
    output: new Amount(0, 'EUR'),
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    global['fetch'] = fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    fetchMock.restore();
  });

  test('update rate every 10 seconds and update the output', async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        ['EUR']: 1.23,
        ['USD']: 4.56,
      }
    });

    const component = mount(<ForeignExchange {...initialState} />);
    expect(component.find('option').at(0).text()).toContain('£ 1.00 = € 1.00');
    jest.advanceTimersByTime(10001);
    act(() => {
      (component.find(InputAmount).at(0).props() as any).setValue(1);
    });
    await act(async () => {
      component.update();
    });
    act(() => {
      component.find(InputAmount).at(1).update();
    });
    expect((component.find(InputAmount).at(1).props() as any).amount.toString()).toEqual('€ 1.23');

    fetchMock.restore();

    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=GBP`, {
      rates: {
        ['EUR']: 4.56,
        ['USD']: 4.56,
      }
    });
    jest.advanceTimersByTime(10001);
    await act(async () => {
      component.update();
    });
    act(() => {
      component.find(InputAmount).at(1).update();
    });
    expect((component.find(InputAmount).at(1).props() as any).amount.toString()).toEqual('€ 4.56');
  });

  test('update ouput on select currency change', async () => {
    fetchMock.mock(`${OPEN_EXCHANGE_ENDPOINT}&base=EUR`, {
      rates: {
        ['EUR']: 4.56,
        ['USD']: 4.56,
      }
    });
    const component = mount(<ForeignExchange {...{...initialState, rates: { USD: 1, EUR: 2 }}} />);
    act(() => {
      (component.find(InputAmount).at(0).props() as any).setValue(1);
    });
    await act(async () => {
      component.update();
    });
    act(() => {
      component.find(InputAmount).at(1).update();
    });
    expect((component.find(InputAmount).at(1).props() as any).amount.toString()).toEqual('€ 2.00');
    act(() => {
      component.find('select').at(0).props().onChange({ target: { value: 'USD' }} as any);
    });
    await act(async () => {
      component.update();
    });
    act(() => {
      component.find(InputAmount).at(1).update();
    });
    expect((component.find(InputAmount).at(1).props() as any).amount.toString()).toEqual('$ 1.00');
  });

  test('toggle currency input and output', async () => {
    const component = mount(<ForeignExchange {...initialState} />);
    expect((component.find(InputAmount).at(0).props() as any).amount).toEqual(initialState.input);
    expect((component.find(InputAmount).at(1).props() as any).amount).toEqual(initialState.output);
    act(() => {
      component.find('img.toggle-arrows').props().onClick(null);
    });
    await act(async () => {
      component.update();
    });
    act(() => {
      component.update();
    });
    expect((component.find(InputAmount).at(0).props() as any).amount).toEqual(initialState.output);
    expect((component.find(InputAmount).at(1).props() as any).amount).toEqual(initialState.input);
  });

  test('change input pocket', async () => {
    const component = mount(<ForeignExchange {...initialState} />);
    act(() => {
      component.find('select.large').at(0).props().onChange({ target: { value: initialState.pockets[1].currency.id }} as any);
    });
    await act(async () => {
      component.update();
    });
    act(() => {
      component.update();
    });
    expect((component.find(InputAmount).at(0).props() as any).amount).toEqual(new Amount(0, initialState.pockets[1].currency.id));
  });

  test('disable exchange button', () => {
    const component = mount(<ForeignExchange {...initialState} />);
    act(() => {
      (component.find(InputAmount).at(0).props() as any).setValue(10);
    });
    act(() => {
      component.update();
    });
    expect(component.find('button').props().disabled).toBeTruthy();

    act(() => {
      (component.find(InputAmount).at(0).props() as any).setValue(1);
    });
    act(() => {
      component.update();
    });
    expect(component.find('button').props().disabled).toBeFalsy();
  });

  test('exchange input amount to output amount', () => {
    const component = mount(<ForeignExchange {...initialState} />);
    expect(component.find(Text).at(0).text()).toContain('Balance £ 1.00');
    act(() => {
      (component.find(InputAmount).at(0).props() as any).setValue(1);
    });
    act(() => {
      component.update();
    });
    act(() => {
      component.find('button').props().onClick(null);
    });
    act(() => {
      component.update();
    });
    expect(component.find(Text).at(0).text()).toContain('Balance £ 0.00');
  });
});
