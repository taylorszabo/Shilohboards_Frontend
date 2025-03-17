import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export default function PerformanceBar(props: {fillPercent: number}) {
    const { fillPercent } = props;

    return (
        <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${fillPercent}%`, backgroundColor: fillPercent <= 33 ? 'red' : fillPercent <= 66 ? 'yellow' : 'green' }]} />
            </View>
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    progressBarContainer: {
        width: "90%",
        height: 18,
        //flex: 1, 
        //alignSelf: 'stretch',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#3E1911",
        overflow: "hidden", 
    },
    progressBar: {
        width: "100%",
        height: "100%",
        backgroundColor: "#E3D1B9",
    },
    progressBarFill: {
        height: "100%", 
        borderRadius: 50,
    },
});