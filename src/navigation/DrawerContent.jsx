import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { routes } from '../navData/menuItem';
import { useState } from 'react';

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
                {isExpanded ? '-' : '+'}
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

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
});

export default DrawerContent;