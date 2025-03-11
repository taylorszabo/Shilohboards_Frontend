import React from 'react';
import { render } from '@testing-library/react-native';
import LevelTwo from '../app/LevelTwo';
import Login from '../app/Login';

test('renders greeting with name', () => {
  const { getByText } = render(<LevelTwo />);
  expect(getByText('Loading questions...')).toBeTruthy();
});





