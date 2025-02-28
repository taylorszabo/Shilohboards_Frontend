import * as React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
    text: string;
    functionToExecute?: Function; //make not optional later? will need to add to all current components though as this will cause errors
    //optional
    onPressRoute?: string;
    bgColor?: string;
    img?: string;
};

export default function CustomButton(props: Props) {
    const { bgColor = '#C3E2E5', text, functionToExecute, onPressRoute } = props;
    const router = useRouter();

    //------------------- FUNCTION ------------------
    function handlePressEvent() {
        //console.log('custom button pressed');
    
        if (functionToExecute) {
            functionToExecute();
        }

        if (onPressRoute) {
            router.push(onPressRoute)
        }

    } 

    return (
        <Pressable style={[styles.btn, { backgroundColor: bgColor }]} onPress={() => handlePressEvent()}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 10,
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
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    },
});