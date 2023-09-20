import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import { userRoleState } from "../../atoms/userRoleState";
import { userPassword } from "../../atoms/userPassword";

export default function LoginScreen() {
  const [idnumber, setIdnumber] = useState("administrator");
  const [password, setPassword] = useState("administrator");

  const setAuthToken = useSetRecoilState(authTokenState);
  const setUserRole = useSetRecoilState(userRoleState);
  const setUserPassword = useSetRecoilState(userPassword);

  const navigation = useNavigation();

  const handleLoginPress = async () => {
    try {
      const response = await fetch("http://10.4.15.12:8004/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idnumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // login successful, store token and user role in Recoil atom
        setAuthToken(data.access_token);
        setUserRole(data.user.role.name);
        setUserPassword(data.user.passcode);
        console.log(data.access_token);
        console.log(data.user.role.name);
        console.log(data.user.passcode);
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
      <Input
        label="ID"
        value={idnumber}
        onChangeText={setIdnumber}
        leftIcon={<Ionicons name="md-person" size={18} color="gray" />}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon={<Ionicons name="ios-lock-closed" size={18} color="gray" />}
      />
      <Button
        title={"Login"}
        raised={true}
        buttonStyle={{ backgroundColor: "#2596BE", paddingHorizontal: 25 }}
        onPress={handleLoginPress}
      />
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
});
