import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} label="Email" />
      <TextInput style={styles.textInput} label="Password" />
      <Button mode="contained">Login</Button>
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
  textInput: {
    width: 335,
    marginBottom: 20,
  },
});

export default LoginScreen;
