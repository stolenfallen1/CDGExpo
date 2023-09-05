import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} label="Email" />
      <TextInput style={styles.textInput} label="Password" />
      <Button
        style={{ backgroundColor: "#2596be" }}
        mode="contained"
        onPress={handleLoginPress}
      >
        Login
      </Button>
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
  textInput: {
    width: 335,
    marginBottom: 20,
    backgroundColor: "#cce3eb",
  },
});
