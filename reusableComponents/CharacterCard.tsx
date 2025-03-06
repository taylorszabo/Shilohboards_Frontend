import * as React from 'react';
import { Text, Image, Pressable, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { useEffect, useCallback, useState } from 'react';
import { tempCharacterArray, characterOptions, formatNameWithCapitals } from "../CharacterOptions";

const screenWidth = Dimensions.get('window').width; //get device width

type Props = {
    customWidth: number;
    id?: number;
    bgColor?: string;
    image?: any;
    name?: string;
    disabled?: boolean;
    onPressRoute?: string;
    customCardStyling?: ViewStyle;
};

// ============================================================================
export default function CharacterCard(props: Props) {
    const { id, bgColor, image, name = '', customWidth, disabled = true, onPressRoute = '', customCardStyling} = props;
    const router = useRouter();
    const [containerWidth, setContainerWidth] = useState(1);    

    //-----------------------------------------------------------------------------------------
    const onLayout = useCallback((event: { nativeEvent: { layout: { width: any; }; }; }) => {
      const { width } = event.nativeEvent.layout;
      setContainerWidth(width); //set parent container width
    }, []);

    const fontSize = containerWidth * 0.1; //% of parent container width

    //-----------------------------------------------------------------------------------------
    return (
        <Pressable disabled={disabled} 
                   onLayout={onLayout} 
                   style={[styles.card, { backgroundColor: id !== undefined ? tempCharacterArray[id].bgColor : bgColor, width: screenWidth * customWidth, height: screenWidth * customWidth }, customCardStyling]} 
                   onPress={() => router.push(onPressRoute)}
        >
            <Image source={id !== undefined ? characterOptions.find(option => option.id === tempCharacterArray[id].picture)?.picture : image} style={styles.image} />
            <Text style={[styles.text, { fontSize: fontSize }]}>{id !== undefined ? formatNameWithCapitals(tempCharacterArray[id].name) : formatNameWithCapitals(name)}</Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: '#A9A9A9',
      },
      image: {
        width: '60%',
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain', //keep aspect ratio
      },
      text: {
        marginTop: '5%',
        textAlign: 'center',
        color: '#3E1911',
        fontWeight: 'bold'
      },
  });