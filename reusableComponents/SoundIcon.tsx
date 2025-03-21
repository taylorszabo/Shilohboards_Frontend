import * as React from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function SoundIcon(props: { size: string; onPress?: () => void }) {
    const { size = '', onPress } = props;

    //convert width to number if it's a percentage
    const numericWidth = size.includes('%')
        ? (parseFloat(size) / 100) * screenWidth  //convert "__%" to pixels
        : parseFloat(size); //keep as is if it's already a number in a string

    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={require('../assets/listen.png')} style={[styles.listenImg, { width: numericWidth, height: numericWidth }]} />
        </TouchableOpacity>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    listenImg: {
        resizeMode: 'contain'
    },
});