import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export default function PerformanceBar(props: {fillPercent: number}) {
    const { fillPercent } = props;
    const red: string = '#C77E62';
    const yellow: string = '#F2CF5D';
    const green: string = '#A0C787';

    function getFillColor(): string {
        if (fillPercent >= 0 && fillPercent <= 33) {
            return red;
        } else if (fillPercent >= 34 && fillPercent <= 66) {
            return yellow;
        } else if (fillPercent >= 67 && fillPercent <= 100) {
            return green;
        } else {
            return '#3E1911';
        }
    }


    return (
        <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${fillPercent}%`, backgroundColor: getFillColor() }]} />
            </View>
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    progressBarContainer: {
        width: "80%",
        height: "55%",
        maxHeight: 15,
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