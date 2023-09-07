import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import userImage from "../../../assets/ProfileAssets/default_user_img.webp";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import axios from "axios";

export default function Profile() {
  const authToken = useRecoilValue(authTokenState);
  const [userData, setUserData] = useState(null);

  // Test purposes
  console.log(authToken);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://10.4.15.206:8004/api/user-details",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data); // Log for testing purposes
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [authToken]);

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
      {userData ? (
        <View>
          <View style={styles.imageContainer}>
            <Image source={userImage} style={styles.avatar} />
          </View>
          <Text style={styles.text}>
            Firstname: {userData.user.details.firstname}
          </Text>
          <Text style={styles.text}>
            Lastname: {userData.user.details.lastname}
          </Text>
          <Text style={styles.text}>
            Birthdate: {userData.user.details.birthdate}
          </Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button
        style={{ backgroundColor: "#2596be" }}
        mode="contained"
        onPress={handleLogoutPress}
      >
        Logout
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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  imageContainer: {
    aspectRatio: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
