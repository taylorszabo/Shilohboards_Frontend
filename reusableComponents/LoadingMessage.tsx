import * as React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import BackgroundLayout from './BackgroundLayout';

export default function LoadingMessage(props: {backgroundNeeded?: boolean, smallVersion?: boolean, oneRow?: boolean}) {
    const { backgroundNeeded = false, smallVersion = false, oneRow = false } = props;
    const textSize = smallVersion ? 20 : 40;
    const spinnerSize = smallVersion ? 30 : oneRow ? 60 : 80;
    const gapSize = oneRow ? smallVersion ? '3%' : '5%' : smallVersion ? '3%' :'7%';
    const colOrRowDirection = oneRow ? 'row-reverse' : 'column';
    const screenSpaceTakenUp = smallVersion ? 0.4 : 0.7;

    if (backgroundNeeded) {
        return (
            <BackgroundLayout>
                <View style={{flex: screenSpaceTakenUp, justifyContent: 'center', alignItems: 'center', gap: gapSize, flexDirection: colOrRowDirection, padding: 15}}>
                    <Text style={{color: '#3E1911', fontSize: textSize, fontWeight: 'bold'}}>Loading...</Text>
                    <ActivityIndicator size={spinnerSize} color="#8c9eaa" />
                </View>
            </BackgroundLayout>
        )
    }

    return (
        <View style={{flex: screenSpaceTakenUp, justifyContent: 'center', alignItems: 'center', gap: gapSize, flexDirection: colOrRowDirection, padding: 15}}>
            <Text style={{color: '#3E1911', fontSize: textSize, fontWeight: 'bold'}}>Loading...</Text>
            <ActivityIndicator size={spinnerSize} color="#8c9eaa" />
        </View>
    );
}