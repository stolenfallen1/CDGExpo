import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRecoilValue } from "recoil";
import { userRoleState } from "../../atoms/userRoleState";
import AdminDashboard from "./admin/adminDashboard";
import DepartmentHead from "./departmentHead/DepartmentHead";
import ConsultantDashboard from "./consultant/consultantDashboard";
import ConptrollerDashboard from "./comptroller/comptrollerDashboard";
import PODashboard from "./PurchaseOrder/PODashboard";

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
  1;
};

const ComptrollerDashboardTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Canvas"
        component={ConptrollerDashboard}
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

const Dashboard = () => {
  const userRole = useRecoilValue(userRoleState);

  return (
    <View style={{ flex: 1 }}>
      {/* CONDITIONAL RENDERING BASED ON USER ROLE */}
      {userRole === "administrator" && <AdminDashboardTabs />}
      {userRole === "department head" && <DepartmentHead />}
      {userRole === "consultant" && <ConsultantDashboard />}
      {userRole === "comptroller" && <ComptrollerDashboardTabs />}
      {userRole === "corporate admin" && <PODashboard />}
      {userRole === "president" && <PODashboard />}
    </View>
  );
};

export default Dashboard;
