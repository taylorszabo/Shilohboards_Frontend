import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainMenu from '../app/MainMenu';

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: jest.fn(() => ({ playerId: '0' })),
}));

//-----------------------------------------------------------
test('Confirm Proper Games Loaded', () => {
  const { getByText } = render(<MainMenu />);

  expect(getByText('Alphabet')).toBeTruthy();
  expect(getByText('Numbers')).toBeTruthy();
});

//-----------------------------------------------------------
test('Confirm Proper Character Name Loaded', () => {
  const { getByText } = render(<MainMenu />);

  //name expected based on player Id passed in
  expect(getByText('Shiloh')).toBeTruthy();
  expect(getByText('Welcome Shiloh! Which game would you like to play?')).toBeTruthy();
});

//-----------------------------------------------------------
test('Confirm Hamburger Menu Opens and Closes', () => {
  const { getByText, getByTestId, queryByText } = render(<MainMenu />);

  //main screen options visible and logout option on hamburger menu is not
  expect(getByText('Welcome Shiloh! Which game would you like to play?')).toBeTruthy();
  expect(queryByText('Logout')).toBeNull();
  
  //press hamburger menu btn to open
  fireEvent.press(getByTestId('hamburgerMenuBtn'));

  //logout option on hamburger menu is visible and main screen text is not
  expect(getByText('Logout')).toBeTruthy();
  expect(queryByText('Welcome Shiloh! Which game would you like to play?')).toBeNull();

  //press to close hamburger menu btn
  fireEvent.press(getByTestId('closeHamburgerMenuBtn'));

  //main screen options visible and logout option on hamburger menu is not
  expect(getByText('Welcome Shiloh! Which game would you like to play?')).toBeTruthy();
  expect(queryByText('Logout')).toBeNull();
});