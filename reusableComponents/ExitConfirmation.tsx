import * as React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../reusableComponents/CustomButton';

type Props = {
    exitRoute: string;
    setExitPopupOpen: Dispatch<SetStateAction<boolean>>;
    //optional
    //functionToExecute?: Function;
};

export default function ExitConfirmation(props: Props) {
    const { exitRoute, setExitPopupOpen } = props;
    const windowHeight = useWindowDimensions().height;

    //----------------------------------------------------------
    return (
        <View style={[styles.container, { minHeight: Math.round(windowHeight) }]}>
            <LinearGradient colors={['rgba(225, 206, 182, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(225, 206, 182, 0.2)']} style={styles.popupBox}>
                <Image source={require('../assets/Icons/exitIcon.png')} style={[styles.icon]}/>
                <Text style={[styles.text, {fontSize: 22}]}>Are you sure you want to exit the game? All progress will not be saved.</Text>
                <View style={[styles.btnContainer]}>
                    <CustomButton text='Cancel' functionToExecute={() => setExitPopupOpen(false)} />
                    <CustomButton text='Yes, exit' onPressRoute={exitRoute} />
                </View>
            </LinearGradient>

        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    backgroundColor: 'rgba(40, 25, 17, 0.6)'
  },
  popupBox: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    overflow: 'hidden',
    padding: '5%',
    borderColor: '#3E1911',
    borderWidth: 5,
    borderRadius: 10
  },
  icon: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    aspectRatio: (496 / 503),
    margin: '5%',
  },
  text: {
    fontWeight: 'bold',
    color: '#3E1911',
    textAlign: 'center'
  },
  btnContainer: {
    flexDirection: 'row',
    marginVertical: '5%'
  }
});