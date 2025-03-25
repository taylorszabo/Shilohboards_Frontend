import * as React from 'react';
import { StyleSheet, Text, Image, Pressable, ViewStyle, TextStyle, ImageStyle,  } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
    //optional
    functionToExecute?: Function;
    onPressRoute?: string;
    text?: string;
    image?: any;
    uniqueButtonStyling?: ViewStyle;
    uniqueTextStyling?: TextStyle; 
    uniqueImageStyling?: ImageStyle; 
    greyedOut?: boolean;
    disabled?: boolean;
    testID?: string;
};

export default function CustomButton(props: Props) {
    const { functionToExecute, onPressRoute, text, image, uniqueButtonStyling, uniqueTextStyling, uniqueImageStyling, greyedOut = false, disabled = false, testID } = props;
    const router = useRouter();

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
        <Pressable
                style={({ pressed }) => [
                    styles.btn,
                    uniqueButtonStyling,
                    greyedOut && { backgroundColor: '#CBCBCB' },
                    pressed && !greyedOut && styles.pressedStyle
                ]} 
                onPress={() => handlePressEvent()} 
                testID={testID}
                disabled={disabled}
        >
            {text &&
                <Text style={[styles.defaultTextStyle, uniqueTextStyling, greyedOut && { color: '#888888' }]}>{text}</Text>
            }
            {image &&
                <Image source={image} style={uniqueImageStyling ? uniqueImageStyling : undefined} />
            }
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        margin: 10,
        backgroundColor: '#C3E2E5',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 8,
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#A9A9A9',
    },
    defaultTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    },
    pressedStyle: { 
        backgroundColor: '#9BD1D6', 
        borderWidth: 3, 
        borderRightWidth: 3, 
        borderBottomWidth: 3, 
        borderColor: '#0098A6', 
        textDecorationLine: 'underline'
    }
});