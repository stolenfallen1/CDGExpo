import { View, Text } from 'react-native'
import React from 'react'

const Dashboard = () => {
  return (
    <View>
      <Text>HELLO WORLD</Text>
    </View>
  )
}

export default Dashboard;


// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import BottomNav from '../../navigation/bottomNav/BottomNav';
// import Profile from '../../components/Profile';

// const Drawer = createDrawerNavigator();

// const DrawerNav = () => {
//   return (
//     <Drawer.Navigator initialRouteName="BottomNav">
//       <Drawer.Screen name="BottomNav" component={BottomNav} />
//       <Drawer.Screen name="Settings" component={Profile} />
//     </Drawer.Navigator>
//   );
// };

// const Dashboard = () => {
//   return (
//     <DrawerNav />
//   );
// };

// export default Dashboard;