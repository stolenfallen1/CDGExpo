import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { routes } from "../navData/menuItem";
import { useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";

const DrawerContent = ({ navigation }) => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (itemName) => {
    if (expandedItems.includes(itemName)) {
      setExpandedItems(expandedItems.filter((item) => item !== itemName));
    } else {
      setExpandedItems([...expandedItems, itemName]);
    }
  };

  const renderMenuItems = (menuItems, level = 0) => {
    return menuItems.map((item) => {
      if (item.screens) {
        const isExpanded = expandedItems.includes(item.name);
        return (
          <View key={item.name} style={{ marginLeft: level * 20 }}>
            <TouchableOpacity
              onPress={() => toggleItem(item.name)}
              style={styles.menuItemButton}
            >
              <Text style={styles.menuItemText}>
                {isExpanded ? (
                  <Icon name="caretup" size={10} color="#2596be" />
                ) : (
                  <Icon name="caretdown" size={10} color="#2596be" />
                )}
              </Text>
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
            {isExpanded && renderMenuItems(item.screens, level + 1)}
          </View>
        );
      } else {
        return (
          <DrawerItem
            key={item.name}
            label={item.name}
            onPress={() => navigation.navigate(item.component)}
            style={{ marginLeft: (level + 1) * 20 }}
            labelStyle={styles.menuItemText}
          />
        );
      }
    });
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <TouchableOpacity onPress={handleProfile}>
          <Image
            source={require("../../assets/ProfileAssets/default_user_img.webp")}
            style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#f7f7f7" }}
          />
        </TouchableOpacity>
        {renderMenuItems(routes)}
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
