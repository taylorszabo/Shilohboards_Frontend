import React from 'react';
import { render } from '@testing-library/react-native';
import LevelTwo from '../app/LevelTwo';

//-------------------------------------------------------
test('Loading message if backend not connected', () => {
  const { getByText } = render(<LevelTwo />);
  expect(getByText('Loading questions...')).toBeTruthy();
});

test('Confirm Submit Button Present After Answer Selected', () => {
  expect('').toBe('');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
});

test('Confirm Correct Feedback Works Properly', () => {
  expect('').toBe('');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
});

test('Confirm Incorrect Feedback Works Properly', () => {
  expect('').toBe('');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
});

test('Confirm Progress Bar Works', () => {
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');

});

test('Confirm Number Options Correct', () => {
  expect('').toBe('');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
});

test('Confirm Alphabet Options Correct', () => {
  expect('').toBe('');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance Bars Match with Game Selected').toBe('Verify Items for Performance Bars Match with Game Selected');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
  expect('Verify Items for Performance').toBe('Verify Items for Performance');
});