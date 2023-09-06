import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [idnumber, setIdnumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPress = async () => {
    try {
      const response = await fetch("http://10.4.15.206:8004/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idnumber, password }),
      });

      if (response.ok) {
        // login successful, show success message and navigate to dashboard
        alert("Login successful!");
        navigation.navigate("Dashboard");
      } else {
        // login failed, show error message
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        label="Email"
        value={idnumber}
        onChangeText={setIdnumber}
      />
      <TextInput
        style={styles.textInput}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
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