import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { routes } from "../navData/menuItem";
import { useState } from "react";

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
    console.log("menuItems:", menuItems);
    console.log("expandedItems:", expandedItems);
    return menuItems.map((item) => {
      if (item.screens) {
        const isExpanded = expandedItems.includes(item.name);
        console.log("isExpanded:", isExpanded);
        return (
          <View key={item.name} style={{ marginLeft: level * 20 }}>
            <TouchableOpacity onPress={() => toggleItem(item.name)}>
              <DrawerItem
                label={item.name}
                icon={() => (
                  <Text>{isExpanded ? "-" : "+"}</Text>
                )}
                onPress={() => {}}
              />
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
          />
        );
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {renderMenuItems(routes)}
      </DrawerContentScrollView>
    </View>
  );
};

export default DrawerContent;