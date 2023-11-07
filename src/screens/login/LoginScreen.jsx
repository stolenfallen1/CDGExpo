import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSetRecoilState } from "recoil";
import { authTokenState } from "../../atoms/authTokenState";
import { userRoleState } from "../../atoms/userRoleState";
import { userBranchID } from "../../atoms/userBranchId";
import { userPassword } from "../../atoms/userPassword";
import { vendorsData } from "../../atoms/vendorsData";
import { unitsData } from "../../atoms/unitsData";
import HomeSplash from "../home/HomeSplash";
import Toast from "react-native-root-toast";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const [idnumber, setIdnumber] = useState("corporate_admin");
  const [password, setPassword] = useState("corporate_admin");

  const setAuthToken = useSetRecoilState(authTokenState);
  const setUserRole = useSetRecoilState(userRoleState);
  const setUserBranchID = useSetRecoilState(userBranchID);
  const setUserPassword = useSetRecoilState(userPassword);
  const setVendorsData = useSetRecoilState(vendorsData);
  const setUnitsData = useSetRecoilState(unitsData);
  const [isSplashReady, setSplashReady] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSplashReady(true);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLoginPress = async () => {
    try {
      const response = await axios.post(`${apiKey}/login`, {
        idnumber,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        // login successful, store token and user role in Recoil atom
        setAuthToken(data.access_token);
        setUserRole(data.user.role.name);
        setUserBranchID(data.user.branch_id);
        setUserPassword(data.user.passcode);

        const authToken = `Bearer ${data.access_token}`;
        const config = {
          headers: { Authorization: authToken },
        };

        // Get all vendors and units
        const [vendors, units] = await Promise.all([
          axios.get(`${apiKey}/vendors?per_page=-1`, config),
          axios.get(`${apiKey}/units?per_page=-1`, config),
        ]);

        const vendorsData = vendors.data.data;
        const unitsData = units.data.units;
        setVendorsData(vendorsData);
        setUnitsData(unitsData);

        navigation.navigate("Dashboard");
        Toast.show("Welcome to MMIS Mobile", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "#5cb85c",
          opacity: 1,
        });
      } else {
        Toast.show("Login failed. Please try again", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: "#d9534f",
        });
      }
    } catch (error) {
      Toast.show("Login failed. Please try again", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#d9534f",
      });
    }
  };

  return (
    <View style={styles.container}>
      {isSplashReady ? (
        <>
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
            leftIcon={
              <Ionicons name="ios-lock-closed" size={18} color="gray" />
            }
          />
          <Button
            title={"Login"}
            raised={true}
            buttonStyle={{ backgroundColor: "#2596BE", paddingHorizontal: 25 }}
            onPress={handleLoginPress}
          />
        </>
      ) : (
        <HomeSplash />
      )}
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
