import { useState } from "react";
import { Text } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons'; 

// Components 
const MusicRoute = () => <Text>Nav 1</Text>;
const AlbumsRoute = () => <Text>Nav 2</Text>;
const RecentsRoute = () => <Text>Nav 3</Text>;
const SettingsRoute = () => <Text>Nav 4</Text>;

export default function BottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'music', title: 'BottomNav 1', focusedIcon: 'heart-circle', unfocusedIcon: 'heart-circle-outline'},
    { key: 'albums', title: 'BottomNav 2', focusedIcon: 'album' },
    { key: 'recents', title: 'BottomNav 3', focusedIcon: 'history' },
    { key: 'settings', title: 'BottomNav 4', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
  ])

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
    recents: RecentsRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
