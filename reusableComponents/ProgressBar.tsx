import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProgressBar(props: {fillPercent: number}) {
    const { fillPercent } = props;

    return (
        <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { width: `${fillPercent}%` }]} />
            </View>
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    progressBarContainer: {
        maxWidth: 500,
        width: "90%",
        height: 18,
        backgroundColor: "#E3D1B9", 
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#3E1911",
        overflow: "hidden", 
    },
    progressBar: {
        width: "100%",
        height: "100%",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#3E1911", 
        borderRadius: 50,
    },
});