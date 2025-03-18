import * as React from "react";
import { Text, Image, Pressable, StyleSheet, Dimensions, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { tempCharacterArray, characterOptions, formatNameWithCapitals } from "../CharacterOptions";

const screenWidth = Dimensions.get("window").width; // Get device width

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
    const {
        id,
        bgColor,
        image,
        name = "",
        customWidth,
        disabled = true,
        onPressRoute = "",
        customCardStyling,
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

    return (
        <Pressable
            disabled={disabled}
            onLayout={onLayout}
            style={[
                styles.card,
                {
                    backgroundColor: characterData ? characterData.bgColor : bgColor || "#FFFFFF", // Default if missing
                    width: screenWidth * customWidth,
                    height: screenWidth * customWidth,
                },
                customCardStyling,
            ]}
            onPress={() => router.push(onPressRoute)}
        >
            {/* Image Handling Fix */}
            <Image
                source={
                    characterData
                        ? characterOptions.find((option) => option.id === characterData.picture)?.picture || image
                        : image
                }
                style={styles.image}
            />

            {/* Name Handling Fix */}
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
    },
});
