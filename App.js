import React from "react";
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
// Drawer Navigation imports for PR
import PRAdmin from "./src/navigation/PRNavigations/Administrator";
import PRDepartmentHead from "./src/navigation/PRNavigations/DHead";
import PRConsultant from "./src/navigation/PRNavigations/Consultant";
import PRCanvas from "./src/navigation/PRNavigations/Comptroller";
// Drawer Navigation import for PO
import POComptroller from "./src/navigation/PONavigations/Comptroller";
import POAdmin from "./src/navigation/PONavigations/Administrator";
import POCorporateAdmin from "./src/navigation/PONavigations/CorporateAdmin";
import POPresident from "./src/navigation/PONavigations/President";
// Admin Navigation imports
import AdminLogs from "./src/screens/dashboard/admin/AdminLogs";
import ApproveCompItems from "./src/screens/dashboard/comptroller/ApproveItems";
import SupplierList from "./src/screens/dashboard/comptroller/SupplierList";
// Filter Modal imports
import ModalFilter from "./src/components/ModalFilter";
import ApprovedCanvas from "./src/screens/dashboard/comptroller/ApprovedCanvas";
import ConsultantLogs from "./src/screens/dashboard/consultant/ConsultantLogs";

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
                  <Drawer.Screen name="MMIS" component={Dashboard} />
                </Drawer.Navigator>
              )}
            </Stack.Screen>
            {/* Filter Modal */}
            <Stack.Screen
              name="FilterModal"
              component={ModalFilter}
              options={{
                title: "Filter Options",
                presentation: "modal",
                cardStyle: {
                  height: 100,
                  overflow: "hidden",
                },
              }}
            />
            {/* Drawer Navigation routes for PR */}
            <Stack.Screen
              name="PR Admin"
              component={PRAdmin}
              options={{ title: "Administrators Transactions" }}
            />
            <Stack.Screen
              name="PR DHead"
              component={PRDepartmentHead}
              options={{ title: "Department Head Transactions" }}
            />
            <Stack.Screen
              name="PR Consultant"
              component={PRConsultant}
              options={{ title: "Consultant Transactions" }}
            />
            <Stack.Screen
              name="PR Canvas"
              component={PRCanvas}
              options={{ title: "Comptroller Transactions" }}
            />
            {/* Drawer Navigation routes for PO */}
            <Stack.Screen
              name="PO Comptroller"
              component={POComptroller}
              options={{ title: "Comptroller Transactions" }}
            />
            <Stack.Screen
              name="PO Admin"
              component={POAdmin}
              options={{ title: "Administrators Transactions" }}
            />
            <Stack.Screen
              name="PO CorporateAdmin"
              component={POCorporateAdmin}
              options={{ title: "Corporate Admin Transactions" }}
            />
            <Stack.Screen
              name="PO President"
              component={POPresident}
              options={{
                title: "President Transactions",
                headerBackTitle: "Back",
              }}
            />
            {/* Admin Log routes */}
            <Stack.Screen
              name="AdminLogs"
              component={AdminLogs}
              options={{ title: "Logs" }}
            />
            {/* Consultant Log routes */}
            <Stack.Screen
              name="ConsultantLogs"
              component={ConsultantLogs}
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
            <Stack.Screen
              name="CanvasHistoryDetails"
              component={ApprovedCanvas}
              options={{ title: "Approved Canvas", presentation: "modal" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}

export default App;
