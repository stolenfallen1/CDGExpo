import { StatusBar } from "expo-status-bar";
import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Navigation imports
import HomeScreen from "./src/screens/home/HomeScreen";
import LoginScreen from "./src/screens/login/LoginScreen";
import Dashboard from "./src/screens/dashboard/Dashboard";
import DrawerContent from "./src/navigation/DrawerContent";
// Drawer Navigation imports
import AdminHistory from "./src/navigation/NavComponents/AdminHistory";
import DepartmentHeadHistory from "./src/navigation/NavComponents/DepartmentHeadHistory";
import ConsultantHistory from "./src/navigation/NavComponents/ConsultantHistory";
import CanvasHistory from "./src/navigation/NavComponents/CanvasHitory";
// Admin Navigation imports
import AdminLogs from "./src/screens/dashboard/admin/AdminLogs";
import ApproveCompItems from "./src/screens/dashboard/comptroller/ApproveItems";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <RecoilRoot>
      <StatusBar style="dark" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false, // disable swipe gesture for navigating back
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
              {() => (
                <Drawer.Navigator drawerContent={DrawerContent}>
                  <Drawer.Screen name="CDG IT" component={Dashboard} />
                </Drawer.Navigator>
              )}
            </Stack.Screen>
            {/* Drawer Navigation routes */}
            <Stack.Screen
              name="adminHistory"
              component={AdminHistory}
              options={{ title: "Administrators Transactions" }}
            />
            <Stack.Screen
              name="dheadHistory"
              component={DepartmentHeadHistory}
              options={{ title: "Department Head Transactions" }}
            />
            <Stack.Screen
              name="consultantHistory"
              component={ConsultantHistory}
              options={{ title: "Consultant Transactions" }}
            />
            <Stack.Screen
              name="comptrollerHistory"
              component={CanvasHistory}
              options={{ title: "Comptroller Transactions" }}
            />
            {/* Admin logs routes */}
            <Stack.Screen
              name="AdminLogs"
              component={AdminLogs}
              options={{ title: "Logs" }}
            />
            {/* Approve Items for Comptroller */}
            <Stack.Screen
              name="ComptrollerApproveItems"
              component={ApproveCompItems}
              options={{ title: "Canvas Approval" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}

export default App;
