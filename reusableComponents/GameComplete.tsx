import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function GameComplete(props: {score: string}) {
    const { score } = props;

    return (
        <View style={styles.textContainer}>
            <Text style={[styles.textCSS, {fontSize: 35}]}>Game Complete!</Text>
            <Text style={styles.textCSS}>{score} Correct</Text>
            <Text style={styles.textCSS}>You've earned 1 star!</Text>
            <Image source={require('../assets/GameOverStar.png')}  style={styles.starImg} />
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    textContainer: {
        alignItems: 'center',
        marginTop: 40
    },
    textCSS: {
        fontWeight: 'bold',
        paddingVertical: 10,
        fontSize: 24
    },
    starImg: {
        marginTop: 30
    }
});