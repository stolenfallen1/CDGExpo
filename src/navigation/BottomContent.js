import { Ionicons } from "@expo/vector-icons";
import { selectedTabState } from "../atoms/selectedTabState";
import { useRecoilState } from "recoil";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminDashboard from "../screens/dashboard/admin/adminDashboard";
import PODashboard from "../screens/dashboard/PurchaseOrder/PODashboard";
import ComptrollerDashboard from "../screens/dashboard/comptroller/comptrollerDashboard";

const Tab = createBottomTabNavigator();

const AdminDashboardTabs = () => {
  const [selectedTab, setSelectedTabState] = useRecoilState(selectedTabState);

  const handleTabPress = (tabName) => {
    setSelectedTabState(tabName);
    console.log("selectedTabState: ", selectedTab);
  };

  return (
    <Tab.Navigator initialRouteName={selectedTab}>
      <Tab.Screen
        name="Purchase Request"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-open-outline" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress("Purchase Request"),
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
        listeners={{
          tabPress: () => handleTabPress("Purchase Order"),
        }}
      />
    </Tab.Navigator>
  );
};

const ComptrollerDashboardTabs = () => {
  const [selectedTab, setSelectedTabState] = useRecoilState(selectedTabState);

  const handleTabPress = (tabName) => {
    setSelectedTabState(tabName);
    console.log("selectedTabState: ", selectedTab);
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Purchase Request"
        component={ComptrollerDashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress("Purchase Request"),
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
        listeners={{
          tabPress: () => handleTabPress("Purchase Order"),
        }}
      />
    </Tab.Navigator>
  );
};

export { AdminDashboardTabs, ComptrollerDashboardTabs };
