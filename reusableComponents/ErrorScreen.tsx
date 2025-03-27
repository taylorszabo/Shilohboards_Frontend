import BackgroundLayout from "./BackgroundLayout";

import * as React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import CustomButton from "./CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ErrorScreen(props: { errorMessage?: string}) {
    const { errorMessage } = props;
    const token =  AsyncStorage.getItem("authToken");


    return (
        <BackgroundLayout>
           <View style={styles.textContainer}>
               <Image source={require("../assets/error.png")} style={styles.errorImg} />
               <Text style={styles.headerText}>Oops, something went wrong!</Text>
               {errorMessage ? (
                    <Text style={styles.textCSS}> {errorMessage} </Text>
                   ):(
                   <Text style={styles.textCSS}>  We must have made a boo-boo!</Text>
               )}
           </View>
            <View style={styles.submitBtnContainer}>
                <CustomButton text='Return' onPressRoute={`/SelectCharacter`} />
            </View>
        </BackgroundLayout>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        alignItems: 'center',
        marginTop: 40
    },
    textCSS: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 10,
        fontSize: 24,
        color: '#3E1911',
    },
    errorImg: {
        marginTop: 30,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    submitBtnContainer: {
        alignSelf: 'center',
        marginTop: 'auto',
        padding: 10,
    },
    headerText: {
        verticalAlign: 'middle',
        padding: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        color: '#f94c4c',
    },
});