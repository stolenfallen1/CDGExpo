import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from "../../components/Settings";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}