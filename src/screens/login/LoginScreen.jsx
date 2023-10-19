import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import { userRoleState } from "../../atoms/userRoleState";
import { userBranchID } from "../../atoms/userBranchId";
import { userPassword } from "../../atoms/userPassword";
import Toast from "react-native-root-toast";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const [idnumber, setIdnumber] = useState("pharma_dep_head");
  const [password, setPassword] = useState("pharma_dep_head");

  const setAuthToken = useSetRecoilState(authTokenState);
  const setUserRole = useSetRecoilState(userRoleState);
  const setUserBranchID = useSetRecoilState(userBranchID);
  const setUserPassword = useSetRecoilState(userPassword);

  const navigation = useNavigation();

  const handleLoginPress = async () => {
    try {
      const response = await fetch(`${apiKey}/login`, {
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
        setUserBranchID(data.user.branch_id);
        setUserPassword(data.user.passcode);
        navigation.navigate("Dashboard");
        Toast.show("Welcome to MMIS Mobile", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 1,
        });
      } else {
        Toast.show("Login failed. Please try again", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: "red",
        });
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
