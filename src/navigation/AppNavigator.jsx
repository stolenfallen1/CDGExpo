import { useState } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomNavigation } from 'react-native-paper';
import Profile from "../components/Profile";

// Components
const MusicRoute = () => <Text>Nav 1</Text>;
const AlbumsRoute = () => <Text>Nav 2</Text>;
const RecentsRoute = () => <Text>Nav 3</Text>;
const SettingsRoute = () => <Profile />;

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BottomNav = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'music',
      title: 'BottomNav 1',
      focusedIcon: 'heart-circle',
      unfocusedIcon: 'heart-circle-outline',
    },
    { key: 'albums', title: 'BottomNav 2', focusedIcon: 'album' },
    { key: 'recents', title: 'BottomNav 3', focusedIcon: 'history' },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-box',
      unfocusedIcon: 'account-box-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
    profile: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const DrawerNav = () => {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Settings" component={SettingsRoute} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DrawerNav" component={DrawerNav} />
      <Tab.Screen name="BottomNav" component={BottomNav} />
    </Tab.Navigator>
  );
};

export default AppNavigator;