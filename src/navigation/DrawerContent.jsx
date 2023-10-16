import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRecoilValue, useRecoilState } from "recoil";
import { userRoleState } from "../atoms/userRoleState";
import { authTokenState } from "../atoms/authTokenState";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DrawerContent = ({ navigation }) => {
  const userRole = useRecoilValue(userRoleState);
  const authToken = useRecoilValue(authTokenState);

  const renderMenuItems = () => {
    const handleLogout = async () => {
      try {
        const response = await axios.post(`${apiKey}/logout`, null, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error);
      }
    };

    if (userRole === "administrator") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("adminHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("dheadHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "department head") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("dheadHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("consultantHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Consultant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("adminHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "consultant") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("consultantHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Consultant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("dheadHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "comptroller") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("comptrollerHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Approved Canvas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "corporate admin" || userRole === "president") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("comptrollerHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Comptroller</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("adminHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("corporateAdminHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Corporate Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("presidentHistory")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>President</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderMenuItems()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingRight: 5,
  },
  menuItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
});

export default DrawerContent;
