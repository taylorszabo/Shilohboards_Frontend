import React, {useEffect} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackgroundLayout from "../reusableComponents/BackgroundLayout";
import CustomButton from "../reusableComponents/CustomButton";

const { width, height } = Dimensions.get("window");

const SiteLink = () => {
  const router = useRouter();
  const { playerId = "0" } = useLocalSearchParams();

    useEffect(() => {
        const checkUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                router.push('/Login');
            }
        };
        checkUser();
    }, []);

  const handleLinkPress = () => {
      if (Platform.OS === "web") {
          window.open("https://shilohboards.com", '_blank')
      }
      else{
          router.push("https://shilohboards.com");
      }
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
      justifyContent: 'center',
      alignItems: "center",
      paddingBottom: 120,
    },
    logo: {
      width: 350,
      height: 350,
      resizeMode: "contain",
    },
    linkButton: {
      width: '85%',
      maxWidth: 500,
    },
    backBtnContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 5,
      paddingVertical: 20
    },
  });
  
  export default SiteLink;