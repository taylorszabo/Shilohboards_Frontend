import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Alert, Pressable } from 'react-native';

type Props = {
    text: string;
    bgColor?: string;
    img?: string;
};

export default function CustomButton(props: Props) {
    const { bgColor = '#C3E2E5', text } = props;

    return (
        <Pressable style={[styles.btn, { backgroundColor: bgColor }]} onPress={() => alert('Card Pressed')}>
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

        shadowColor: 'rgba(0, 0, 0, 0.25)', //iOS shadow
        shadowOffset: {
            width: 1,
            height: 4
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,

        elevation: 3, //android shadow
        
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold',
    },
});