import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>HELLO WORLD</Text>
      <Button title="Sign In" onPress={handleLoginPress} />
      <Text style={styles.textFooter}>© Alright reserved 2023</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
  },
  textFooter: {
    position: "absolute",
    bottom: 25,
    fontSize: 18,
  },
});

export default HomeScreen;
