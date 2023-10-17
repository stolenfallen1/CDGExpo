import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminDashboard from "../screens/dashboard/admin/adminDashboard";
import PODashboard from "../screens/dashboard/PurchaseOrder/PODashboard";
import ComptrollerDashboard from "../screens/dashboard/comptroller/comptrollerDashboard";

const Tab = createBottomTabNavigator();

const AdminDashboardTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Purchase Request"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-open-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Purchase Order"
        component={PODashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ComptrollerDashboardTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Canvas"
        component={ComptrollerDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Purchase Order"
        component={PODashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export { AdminDashboardTabs, ComptrollerDashboardTabs };
