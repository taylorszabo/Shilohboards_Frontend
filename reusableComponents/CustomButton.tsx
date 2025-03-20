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
    disabled?: boolean;
    testID?: string;
};

export default function CustomButton(props: Props) {
    const { functionToExecute, onPressRoute,text, image, uniqueButtonStyling, uniqueTextStyling, uniqueImageStyling, disabled = false, testID } = props;
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
        <Pressable style={[styles.btn, uniqueButtonStyling, disabled && {backgroundColor: '#d3d3d3'}]} onPress={() => handlePressEvent()} testID={testID}>
            {text &&
                <Text style={[styles.defaultTextStyle, uniqueTextStyling]}>{text}</Text>
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
});