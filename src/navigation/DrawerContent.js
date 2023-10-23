import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";
import { authTokenState } from "../atoms/authTokenState";
import CDUHLOGO from "../../assets/HomeScreenAssets/CDUH-logo.png";
import { customStyles } from "../styles/customStyles";
import axios from "axios";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DrawerContent = ({ navigation }) => {
  const userRole = useRecoilValue(userRoleState);
  const authToken = useRecoilValue(authTokenState);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${apiKey}/logout`, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      navigation.navigate("Home");
      // Add toast message here
    } catch (error) {
      console.error(error);
    }
  };

  const renderMenuItems = () => {
    if (userRole === "administrator") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR Admin")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR DHead")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "department head") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR DHead")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR Consultant")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Consultant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR Admin")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "consultant") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR Consultant")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Consultant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR DHead")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Department Head</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "comptroller") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PR Canvas")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Approved Canvas</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (userRole === "corporate admin" || userRole === "president") {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("PO Comptroller")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Comptroller</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PO Admin")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Administrator</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PO CorporateAdmin")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>Corporate Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PO President")}
            style={customStyles.menuItemButton}
          >
            <Text style={customStyles.menuItemText}>President</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={customStyles.imageContainer}>
        <Image source={CDUHLOGO} style={customStyles.cduLogo} />
      </View>
      {renderMenuItems()}
      <View style={customStyles.logoutContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={customStyles.menuItemButton}
        >
          <Text style={customStyles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingRight: 5,
  },
});

export default DrawerContent;
