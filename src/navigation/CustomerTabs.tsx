import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CartScreen from "../screens/customer/CartScreen";
import HomeScreen from "../screens/customer/HomeScreen";
import ProfileScreen from "../screens/customer/ProfileScreen";
import WishlistScreen from "../screens/customer/WishlistScreen";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}