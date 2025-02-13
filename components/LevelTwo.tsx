import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Alert, Pressable, Image } from 'react-native';
import Constants from "expo-constants";
import CharacterCard from './CharacterCard';
import CustomButton from './CustomButton';
import OptionCard from './OptionCard';

type Props = {
    alphabetGame: boolean;
};

export default function LevelTwo(props: Props) {
    const { alphabetGame } = props;

    return (
        <View style={styles.container}> 
            <View style={{position: 'absolute', top: 0, left: 0, paddingLeft: 10}}>
                <CustomButton text='<'/>
            </View>
            <CharacterCard bgColor='#C0E3B9' imagePath='../assets/Hotdog.png' name='Shiloh' customWidth={0.25} disabled={true}/>
            <Text style={styles.title}>Alphabet - Level 2 </Text>
            <Image
                source={require('../assets/fakeProgressBar.png')}
                style={{width: '80%', height: 25}}
            />
            <Text style={styles.title}>Choose the correct picture and word for the letter shown: </Text>
            <View style={{flexDirection: 'row'}}>
                {/* ========================================= LEFT SIDE ============================================ */}
                <View style={{width: '35%', maxHeight: '100%', alignItems: 'center', justifyContent: 'center', paddingRight: 25}}>
                    <Image
                        // source={lowerText === 'Alphabet' ? require('../assets/A.png') : require('../assets/1.png')}
                        source={require('../assets/Atest.png')}
                        style={styles.image}
                    />
                    <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18, paddingVertical: 10, color: '#3E1911'}}>Tap letter to hear sound</Text>
                    <Image
                        source={require('../assets/listen.png')}
                        style={{width: '25%', height: 25, resizeMode: 'contain'}}
                    />
                </View>
                
                {/* ========================================= RIGHT SIDE ============================================ */}
                <View style={{gap: 15}}>
                    <OptionCard hasImage={true} lowerText='Flower' customWidth={0.26} disabled={false}/>
                    <OptionCard hasImage={true} lowerText='Apple' customWidth={0.26} disabled={false}/>
                    <OptionCard hasImage={true} lowerText='Umbrella' customWidth={0.26} disabled={false}/>
                </View>
            </View>
            
            <View style={{alignSelf: 'flex-end', marginTop: 'auto', padding: 10}}>
                <CustomButton text='Submit'/>
            </View>
            
        </View>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight + 10,
    alignItems: 'center',
    position: 'relative'
  },
  title: {
    verticalAlign: 'middle',
    padding: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3E1911',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain' 
  }
});