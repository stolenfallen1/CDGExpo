import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CDUHLOGO from "../../assets/HomeScreenAssets/CDUH-logo.png";

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
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
