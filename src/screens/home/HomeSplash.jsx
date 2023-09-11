import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

const HomeSplash = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    axios
      .get("https://api.quotable.io/random?maxLength=50")
      .then((response) => setQuote(response.data.content))
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.textSplash}>{quote}</Text>
    </View>
  );
};

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
    fontSize: 30,
    fontWeight: "bold",
    paddingHorizontal: 15,
    textAlign: "center",
  },
});

export default HomeSplash;
