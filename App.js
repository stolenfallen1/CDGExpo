import { RecoilRoot } from "recoil";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./src/screens/home/HomeScreen";
import LoginScreen from "./src/screens/login/LoginScreen";
import Dashboard from "./src/screens/dashboard/Dashboard";
import DrawerContent from "./src/navigation/DrawerContent";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <RecoilRoot>
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
          <Stack.Screen
            name="Dashboard"
            options={{ headerShown: false }}
          >
            {() => (
              <Drawer.Navigator drawerContent={DrawerContent}>
                <Drawer.Screen name="CDG IT" component={Dashboard} />
              </Drawer.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
