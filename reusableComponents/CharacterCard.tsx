import * as React from 'react';
import { Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width; //get device width

type ImageKey = 'hotdog' | 'flower' | 'tree' | 'whale' | 'moon' | 'penguin';

const images: Record<ImageKey, any> = {
    hotdog: require('../assets/Alphabet/Images/Hotdog.png'),
    flower: require('../assets/Flower.png'),
    tree: require('../assets/Tree.png'),
    whale: require('../assets/Whale.png'),
    moon: require('../assets/Moon.png'),
    penguin: require('../assets/Penguin.png')
  };

type Props = {
    bgColor: string;
    image: ImageKey;
    name: string;
    customWidth: number;
    //optional
    disabled?: boolean;
    onPressRoute?: string;
    id?: string;
};

// ============================================================================
export default function CharacterCard(props: Props) {
    const { bgColor, image, name, customWidth, disabled = true, onPressRoute = ''} = props;
    const router = useRouter();

    return (
        <Pressable disabled={disabled} style={[styles.card, { backgroundColor: bgColor, width: screenWidth * customWidth, height: screenWidth * customWidth }]} 
        onPress={() => router.push(onPressRoute)}>
            <Image source={images[image]} style={styles.image} />
            <Text style={styles.text}>{name}</Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d3d3d3',
        //iOS shadow
        shadowColor: 'rgba(0, 0, 0, 0.25)', 
        shadowOffset: {
            width: 1,
            height: 4
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        //android shadow
        elevation: 5, 
      },
      image: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain', //keep aspect ratio
      },
      text: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
      },
  });