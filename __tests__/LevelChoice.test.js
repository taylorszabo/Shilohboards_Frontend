import React from 'react';
import { render } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import LevelChoice from '../app/LevelChoice';

jest.mock('expo-router', () => ({
    ...jest.requireActual('expo-router'),
    useLocalSearchParams: jest.fn(),
}));

describe('LevelChoice Tests', () => {
    //reset the mock before each test
    beforeEach(() => {
      useLocalSearchParams.mockClear();
    });
  
    //--------------------------------------------------------------------------
    test('Confirm Alphabet Game has 3 Level Options', () => {
        useLocalSearchParams.mockReturnValueOnce({ game: 'Alphabet' });
        const { getByText, queryByText } = render(<LevelChoice />);
      
        expect(getByText('Choose a level for the Alphabet Activity:')).toBeTruthy();
        expect(getByText('Level 1')).toBeTruthy();
        expect(getByText('Level 2')).toBeTruthy();
        expect(getByText('Level 3')).toBeTruthy();

        expect(queryByText('Level 0')).toBeNull();
        expect(queryByText('Level 4')).toBeNull();
    });

    //--------------------------------------------------------------------------
    test('Confirm Numbers Game has 2 Level Options', () => {
        useLocalSearchParams.mockReturnValueOnce({ game: 'Numbers' });
        const { getByText, queryByText } = render(<LevelChoice />);
      
        expect(getByText('Choose a level for the Numbers Activity:')).toBeTruthy();
        expect(getByText('Level 1')).toBeTruthy();
        expect(getByText('Level 2')).toBeTruthy();

        expect(queryByText('Level 0')).toBeNull();
        expect(queryByText('Level 3')).toBeNull();
    });

});