import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function Logout() {
  const navigation = useNavigation();

  const handleLogoutPress = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Profile data */}
      <Image />
      <Text>Firstname</Text>
      <Text>Lastname</Text>
      <Button onPress={handleLogoutPress}>Logout</Button>
    </View>
  );
}