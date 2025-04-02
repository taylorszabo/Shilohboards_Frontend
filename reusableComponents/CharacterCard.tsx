import * as React from "react";
import { Text, Image, Pressable, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { tempCharacterArray, characterOptions, formatNameWithCapitals } from "../CharacterOptions";

type Props = {
    heightPercentNumber?: number;
    customWidth?: number;
    id?: number;
    bgColor?: string;
    image?: any;
    name?: string;
    disabled?: boolean;
    onPressRoute?: string;
    customCardStyling?: ViewStyle;
    deleteModeFunction?: Function;
    selected?: boolean;
};

// ============================================================================
export default function CharacterCard(props: Props) {
    const {
        customWidth,
        id,
        bgColor,
        image,
        name = "",
        heightPercentNumber = 13,
        disabled = true,
        onPressRoute = "",
        customCardStyling,
        deleteModeFunction,
        selected = false,
    } = props;

    const router = useRouter();
    const [containerWidth, setContainerWidth] = useState(1);

    //-----------------------------------------------------------------------------------------
    const onLayout = useCallback((event: { nativeEvent: { layout: { width: any } } }) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width); // Set parent container width
    }, []);

    const fontSize = containerWidth * 0.1; // % of parent container width

    // **Check if ID exists in `tempCharacterArray` before accessing it**
    const characterData = id !== undefined && tempCharacterArray[id] ? tempCharacterArray[id] : null;

    function handlePressEvent() {
        if (deleteModeFunction !== undefined) {
            deleteModeFunction();
        }
        else if (onPressRoute) {
            router.push(onPressRoute)
        }
    }

    return (
        <Pressable
            disabled={disabled}
            onLayout={onLayout}
            style={({ pressed }) =>[
                styles.card,
                customWidth ?
                    {
                        backgroundColor: characterData ? characterData.bgColor : bgColor || "#FFFFFF", // Default if missing
                        width: customWidth,
                        height: customWidth,
                    } 
                    :
                    {
                        backgroundColor: characterData ? characterData.bgColor : bgColor || "#FFFFFF", // Default if missing
                        height: `${heightPercentNumber}%`,
                        aspectRatio: 1
                    },
                customCardStyling,
                selected && deleteModeFunction !== undefined && styles.selectedStyling,
                pressed && !disabled && styles.selectedStyling
            ]}
            onPress={() => handlePressEvent()}
        >
            {/* Image Handling */}
            <Image
                source={
                    characterData
                        ? characterOptions.find((option) => option.id === characterData.picture)?.picture || image
                        : image
                }
                style={styles.image}
            />

            {/* Name Handling */}
            <Text style={[styles.text, { fontSize: fontSize }]}>
                {characterData
                    ? formatNameWithCapitals(characterData.name)
                    : formatNameWithCapitals(name)}
            </Text>
        </Pressable>
    );
}

// ================================== STYLING ==================================
const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 2,
        borderBottomWidth: 3,
        borderColor: "#A9A9A9",
    },
    image: {
        width: "60%",
        height: "60%",
        resizeMode: "contain", // Keep aspect ratio
    },
    text: {
        marginTop: "5%",
        textAlign: "center",
        color: "#3E1911",
        fontWeight: "bold",
        maxWidth: '100%'
    },
    selectedStyling: {
        borderWidth: 5, 
        borderRightWidth: 5, 
        borderBottomWidth: 5, 
        borderColor: '#0098A6'
    },
});
