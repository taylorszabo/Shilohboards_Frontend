import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import CustomButton from './CustomButton';
import BackgroundLayout from "./BackgroundLayout";
import {useLocalSearchParams} from "expo-router";

export default function GameComplete(props: {score: string}) {
    const { score } = props;
    const { playerId = '0' } = useLocalSearchParams();
    return (
        <BackgroundLayout>
            <View style={styles.textContainer}>
                <Text style={[styles.textCSS, {fontSize: 35}]}>Game Complete!</Text>
                <Text style={styles.textCSS}>{score} Correct</Text>
                <Text style={styles.textCSS}>You've earned 1 star!</Text>
                <Image source={require('../assets/GameOverStar.png')}  style={styles.starImg} />

                <View style={styles.submitBtnContainer}>
                    <CustomButton text='Main Menu' onPressRoute={`/MainMenu?playerId=${playerId}`}/>
                </View>
            </View>
        </BackgroundLayout>

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
    },
    submitBtnContainer: {
        alignSelf: 'flex-end', 
        marginTop: 'auto', 
        padding: 10
      },
});