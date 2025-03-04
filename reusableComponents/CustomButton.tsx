import * as React from 'react';
import { StyleSheet, Text, Image, Pressable, ViewStyle, TextStyle, ImageStyle  } from 'react-native';
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
};

export default function CustomButton(props: Props) {
    const { functionToExecute, onPressRoute, text, image, uniqueButtonStyling, uniqueTextStyling, uniqueImageStyling } = props;
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
        <Pressable style={[styles.btn, uniqueButtonStyling]} onPress={() => handlePressEvent()}>
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
        borderWidth: 1,
        borderColor: '#d3d3d3',
        //iOS shadow
        shadowColor: 'rgba(0, 0, 0, 0.25)', 
        shadowOffset: {
            width: 1,
            height: 4
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        //android shadow
        elevation: 3, 
    },
    defaultTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    },
});