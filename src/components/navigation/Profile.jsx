import React from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";

export default function Logout() {
  const authToken = useRecoilValue(authTokenState);

  // Test purposes
  console.log(authToken);

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
            // delete token from Recoil atom
            // navigate to login screen
            navigation.navigate("Login");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile data */}
      {/* <Image /> */}
      <Text style={styles.text}>Hello World</Text>
      <Button onPress={handleLogoutPress}>Logout</Button>
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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
