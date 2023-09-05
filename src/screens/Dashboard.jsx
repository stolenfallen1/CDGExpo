import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from "../components/navigation/functionComponents/Settings";
import BottomNav from "../components/navigation/bottomNav/BottomNav";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <>
      <Drawer.Navigator initialRouteName="Dashboard">
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
      <BottomNav/>
    </>
  );
}
