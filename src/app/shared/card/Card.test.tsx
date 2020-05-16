import React from 'react';
import { shallow } from 'enzyme'; 
import Card from './Card';

describe('Card', () => {
  test('matches snapshot', () => {
    const card = shallow(<Card style={{ color: 'white', backgroundColor: 'black'}}>Luke, I am your father!</Card>)
    expect(card.debug()).toMatchSnapshot();
  })
})