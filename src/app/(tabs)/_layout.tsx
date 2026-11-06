import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const tabIcons: Record<string, string> = {
  index: '⌂',
  activity: '≡',
  insights: '◔',
  budget: '▤',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#214D3D',
        tabBarInactiveTintColor: '#9AA39D',
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 22, fontWeight: '600' }}>
            {tabIcons[route.name]}
          </Text>
        ),
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 2 },
        tabBarStyle: {
          backgroundColor: '#FBFAF7',
          borderTopColor: '#E9EAE5',
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
      <Tabs.Screen name="budget" options={{ title: 'Budget' }} />
    </Tabs>
  );
}
