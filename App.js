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
import SupplierList from "./src/screens/dashboard/comptroller/SupplierList";
// Filter Modal imports
import ModalFilter from "./src/components/ModalFilter";

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
            {/* Canvas - Supplier List routes */}
            <Stack.Screen
              name="SupplierCanvasList"
              component={SupplierList}
              options={{ title: "List of Suppliers", presentation: "modal" }}
            />
            {/* Filter Modal */}
            <Stack.Screen
              name="FilterModal"
              component={ModalFilter}
              options={{
                title: "Filter Options",
                presentation: "modal",
                cardStyle: {
                  height: 100, // Set the height of the modal to 75% of the screen height
                  overflow: "hidden", // Hide the overflowing content from Modal
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}

export default App;
