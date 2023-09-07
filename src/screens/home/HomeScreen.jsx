import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CDUHLOGO from "../../../assets/HomeScreenAssets/CDUH-logo.png";
import HomeSplash from "./HomeSplash";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSplashReady(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleHomePress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {isSplashReady ? (
        <>
          <View style={styles.imageContainer}>
            <Image source={CDUHLOGO} style={styles.cduLogo} />
          </View>
          <Button
            style={{ backgroundColor: "#2596be" }}
            mode="contained"
            onPress={handleHomePress}
          >
            Get started
          </Button>
          <Text style={styles.textFooter}>© Alright reserved 2023</Text>
        </>
      ) : (
        <HomeSplash />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    aspectRatio: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cduLogo: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  textFooter: {
    position: "absolute",
    bottom: 30,
    fontSize: 18,
  },
});