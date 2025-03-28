import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";

const { width, height } = Dimensions.get("window");

const SiteLink = () => {
  const router = useRouter();
  const { playerId = "0" } = useLocalSearchParams();

  const handleLinkPress = () => {
    router.push("https://shilohboards.com");
  };

  return (
    <BackgroundLayout>
      <View style={styles.container}>
        <CustomButton image={require('../assets/back.png')} uniqueButtonStyling={styles.backBtnContainer} onPressRoute={`/MainMenu?playerId=${playerId}`}/>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        <CustomButton
          text="Visit our official website to learn more about Shiloh Boards or to
            purchase a physical board!"
          functionToExecute={handleLinkPress}
          uniqueButtonStyling={styles.linkButton}
        />
      </View>
    </BackgroundLayout>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: width * 0.08,
      paddingTop: height * 0.08,
    },
    logo: {
      width: width * 0.6,
      height: width * 0.6,
      resizeMode: "contain",
      marginTop: height * 0.01,
      marginBottom: height * 0.05,
    },
    linkButton: {
      width: width * 0.9,
      height: height * 0.15,
      marginTop: height * 0.0,
    },
    backBtnContainer: {
      position: "absolute",
      top: height * 0.02,
      left: width * 0.02,
      paddingVertical: height * 0.02,
    },
  });
  
  export default SiteLink;