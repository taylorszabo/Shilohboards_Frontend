import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import CharacterCreation from '../app/CharacterCreation';

jest.mock('expo-router', () => ({
    ...jest.requireActual('expo-router'),
    //useLocalSearchParams: jest.fn(() => ({ isNewOrUpdateId: 'New' })),
    useLocalSearchParams: jest.fn(),
}));

describe('Character Tests', () => {
    //reset the mock before each test
    beforeEach(() => {
      useLocalSearchParams.mockClear();
      useLocalSearchParams.mockReturnValue({ isNewOrUpdateId: 'New' });
    });
  
    //--------------------------------------------------------------------------
    test('Confirm Empty Input Field Error Handled Properly', () => {
        useLocalSearchParams.mockReturnValueOnce({ isNewOrUpdateId: 'New' });
        const { getByText } = render(<CharacterCreation />);
    
        const textInputInstruction = getByText('Please enter your name:');
        const nextBtn = getByText('Next');
    
        expect(textInputInstruction).toBeTruthy(); //check it exists
        expect(textInputInstruction).toHaveStyle({ color: '#3E1911' });
        expect(nextBtn).toBeTruthy();
    
        fireEvent.press(nextBtn);
    
        //instruction text is highlighted red if a name is not entered
        expect(textInputInstruction).toHaveStyle({ color: 'red' });
    });
  
    //--------------------------------------------------------------------------
    test('Confirm New Character Created Steps Working', async () => {
        useLocalSearchParams.mockReturnValueOnce({ isNewOrUpdateId: 'New' });
        const { getByText, getByTestId, queryByText } = render(<CharacterCreation />);
    
        const textInputInstruction = getByText('Please enter your name:');
        const nextBtn = getByText('Next');
        const characterNameInput = getByTestId('characterNameInput');
        const optionCard = getByTestId('moon');
        
        expect(textInputInstruction).toBeTruthy(); //step 1 visible
        expect(queryByText('Please choose your background colour:')).toBeNull(); //step 2 not visible
        expect(nextBtn).toBeTruthy();
        expect(characterNameInput.props.value).toBe(''); //name input empty
        
        //enter name
        fireEvent.changeText(characterNameInput, 'testName');
        expect(characterNameInput.props.value).toBe('testName');
    
        //choose character
        expect(optionCard).toBeTruthy();
        fireEvent.press(optionCard);
    
        //press next button
        fireEvent.press(nextBtn);
    
        //next step should appear on the screen
        await waitFor(() => {
            expect(getByText('Please choose your background colour:')).toBeTruthy();
        });
        const colorOptionCard = getByTestId('#FDFFB8'); //yellow
        expect(colorOptionCard).toBeTruthy();
    
        //choose background color
        fireEvent.press(colorOptionCard);
    
        //press next button
        fireEvent.press(nextBtn);
    
        //next/final step should appear on the screen
        await waitFor(() => {
            expect(getByText('Character Review')).toBeTruthy();
            expect(getByText('Testname')).toBeTruthy(); //capitalize 1st letter function working
        });
    });

    //--------------------------------------------------------------------------
    test('Confirm Update Id Passes in Current User Data', () => {
        useLocalSearchParams.mockReturnValueOnce({ isNewOrUpdateId: '0' });
        const { getByTestId } = render(<CharacterCreation />);
    
        const characterNameInput = getByTestId('characterNameInput');
        expect(characterNameInput.props.value).toBe('Shiloh');
    });

});