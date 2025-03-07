import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import CustomButton from './CustomButton';
import BackgroundLayout from "./BackgroundLayout";
import {useLocalSearchParams} from "expo-router";
import CharacterCard from "./CharacterCard";
import ProgressBar from "./ProgressBar";

export default function GameComplete(props: {game: string | string[], score: string, level: string}) {
    const { game, score, level} = props;
    const { playerId = '0' } = useLocalSearchParams();
    return (
        <BackgroundLayout>
            <View style={styles.textContainer}>
                <CharacterCard id={parseInt(playerId.toString())} customWidth={0.25}/>

                <Text style={styles.headerText}>{game} - Level {level}</Text>

                <ProgressBar fillPercent={100} />

                <Text style={[styles.textCSS, {fontSize: 35}]}>Game Complete!</Text>
                <Text style={styles.textCSS}>Score {score}</Text>
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
        fontSize: 24,
        color: '#3E1911',
    },
    starImg: {
        marginTop: 30
    },
    submitBtnContainer: {
        alignSelf: 'center',
        marginTop: 'auto', 
        padding: 10
      },
    headerText: {
        verticalAlign: 'middle',
        padding: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        color: '#3E1911',
    },
});