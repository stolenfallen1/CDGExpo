import { View, Text, StyleSheet } from "react-native"

export default function HomeSplash() {
    return (
        <View style={styles.splashContainer}>
            <Text style={styles.textSplash}>Hi, There 👋</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    splashContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
    },
    textSplash: {
      color: "#fff",
      fontSize: 40,
      fontWeight: "bold",
    },
  });