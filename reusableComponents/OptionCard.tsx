import * as React from 'react';
import { Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';

type Props = {
    square: boolean;
    customWidth?: number;
    //optional
    bgColor?: string;
    image?: any;
    upperText?: string;
    lowerText?: string;
    lowerTextSize?: number;
    disabled?: boolean;
    onPressRoute?: string;
    textSize?: number;
    functionToExecute?: Function;
    selected?: boolean;
    boldFirstLetter?: boolean;
    testID?: string;
};

export default function OptionCard(props: Props) {
    const { square,
            bgColor = '#FFF8F0', 
            image, 
            lowerText, 
            lowerTextSize = 0.15,
            upperText = 'Option', 
            customWidth = '85%', 
            disabled = false, 
            onPressRoute, 
            textSize = 24,
            functionToExecute,
            selected,
            boldFirstLetter = false,
            testID
    } = props;

    const router = useRouter();
    const [containerWidth, setContainerWidth] = useState(1);

    let firstLetter;
    let restOfText;

    if (lowerText) {
        firstLetter = lowerText.charAt(0);
        restOfText = lowerText.slice(1);
    }

    const onLayout = useCallback((event: { nativeEvent: { layout: { width: any } } }) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width); //set parent container width
        }, []);
    
    const fontSize = containerWidth * lowerTextSize; //% of parent container width

    //------------------- FUNCTION ------------------
    function handlePressEvent() {   
        if (functionToExecute) {
            functionToExecute();
        }

        if (onPressRoute) {
            router.push(onPressRoute)
        }
    } 

    //-----------------------------------------------
    return (
        <Pressable disabled={disabled} testID={testID}
            onLayout={onLayout}
            style={({ pressed }) => [
                styles.card, 
                selected && styles.selectedStyling, 
                square ? {aspectRatio: 1} : {width: customWidth},
                { 
                    backgroundColor: bgColor, 
                },
                pressed && styles.pressedStyle
            ]} 
            onPress={() => handlePressEvent()}
        >
            {image ?
                <Image source={image} style={styles.image} />
                :
                <Text style={[styles.highText, {fontSize: textSize}]}>{upperText}</Text>
            }
            
            {lowerText &&
                <Text style={[styles.lowText, { fontSize: fontSize }]}>
                    {boldFirstLetter ? (
                        <Text style={styles.boldUnderline}>{firstLetter}</Text>
                    ) : (
                        firstLetter
                    )}
                    {restOfText}
                </Text>
            }
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#A9A9A9',
        maxWidth: '100%',
        padding: 10
    },
    image: {
        width: '100%',
        flex: 1,
        resizeMode: 'contain' //keep aspect ratio
    },
    lowText: {
        marginTop: 10,
        fontSize: 18,
        textAlign: 'center',
        color: '#3E1911',
    },
    boldUnderline: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    highText: {
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    },
    selectedStyling: {
        borderWidth: 5, 
        borderRightWidth: 5, 
        borderBottomWidth: 5, 
        borderColor: '#0098A6'
    },
    pressedStyle: { 
        backgroundColor: '#E9E0D6',
    }
});