import { Tabs } from 'expo-router';
import { colors } from '../../../theme/tokens';

export default function MainTabs() {
  return <Tabs screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background }, tabBarStyle: { display: 'none' } }}><Tabs.Screen name="home" /><Tabs.Screen name="statement" /><Tabs.Screen name="investments" /><Tabs.Screen name="charts" /></Tabs>;
}
