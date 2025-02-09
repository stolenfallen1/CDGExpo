import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../atoms/userRoleState";
import { authTokenState } from "../atoms/authTokenState";
import { selectedTabState } from "../atoms/selectedTabState";
import CDUHLOGO from "../../assets/HomeScreenAssets/CDUH-logo.png";
import { customStyles } from "../styles/customStyles";
import Toast from "react-native-root-toast";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_API_URL;

const DrawerContent = () => {
  const userRole = useRecoilValue(userRoleState);
  const authToken = useRecoilValue(authTokenState);
  const selectedTab = useRecoilValue(selectedTabState);

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${apiKey}/logout`, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        navigation.navigate("Login");
        Toast.show("Successfully logged out", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          backgroundColor: "#5cb85c",
          opacity: 1,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderMenuItems = () => {
    if (userRole === "administrator") {
      if (selectedTab === "Purchase Request") {
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
      } else if (selectedTab === "Purchase Order") {
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
      if (selectedTab === "Purchase Request") {
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
      } else if (selectedTab === "Purchase Order") {
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
