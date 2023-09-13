import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";

const DrawerContent = ({ navigation }) => {
  const userRole = useRecoilValue(userRoleState);

  const renderMenuItems = () => {
    if (userRole === "administrator") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("A_HISTORY")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
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
            onPress={() => navigation.navigate("DH_HISTORY")}
            style={styles.menuItemButton}
          >
            <Text style={styles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
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
            onPress={() => navigation.navigate("Login")}
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
