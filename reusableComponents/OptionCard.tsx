import * as React from 'react';
import { Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

type ImageKey = 'default' | 'hotdog' | 'flower' | 'tree' | 'whale' | 'moon' | 'penguin' | 'num' | 'alpha' | 'apple' ;

const images: Record<ImageKey, any> = {
    default: require('../assets/defaultImage.png'),
    hotdog: require('../assets/Hotdog.png'),
    flower: require('../assets/Flower.png'),
    tree: require('../assets/Tree.png'),
    whale: require('../assets/Whale.png'),
    moon: require('../assets/Moon.png'),
    penguin: require('../assets/Penguin.png'),
    num: require('../assets/123.png'),
    alpha: require('../assets/ABC.png'),
    apple: require('../assets/Apple.png'),
};

const screenWidth = Dimensions.get('window').width; //get device width

type Props = {
    onPressRoute: string;
    lowerText: string;
    customWidth: number;
    //optional
    height?: number;
    bgColor?: string;
    image?: ImageKey;
    upperText?: string;
    disabled?: boolean;
};

export default function OptionCard(props: Props) {
    const { bgColor = '#FFF8F0', image = 'default', lowerText, upperText = 'Option', customWidth, disabled = false, height = 100, onPressRoute } = props;
    const router = useRouter();

    return (
        <Pressable disabled={disabled} style={[styles.card, { backgroundColor: bgColor, width: screenWidth * customWidth, height: height }]} 
        onPress={() => router.push(onPressRoute)}>
            {image !== 'default' ?
                <Image source={images[image]} style={styles.image} />
                :
                <Text style={styles.highText}>{upperText}</Text>
            }
            
            <Text style={styles.lowText}>{lowerText}</Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

        shadowColor: 'rgba(0, 0, 0, 0.25)', //iOS shadow
        shadowOffset: {
            width: 1,
            height: 4
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,

        elevation: 5, //android shadow
    },
    image: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain' //keep aspect ratio
    },
    lowText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
    },
    highText: {
        marginTop: 10,
        fontSize: 24,
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
    }
});