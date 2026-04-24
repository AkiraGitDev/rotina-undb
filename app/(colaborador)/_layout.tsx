import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors, FontSize, FontWeight, LetterSpacing } from '@/constants/theme';

export default function ColaboradorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.racingRed,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.pitchBlack,
          borderTopColor: Colors.border.subtle,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
          letterSpacing: LetterSpacing.wide,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="minhas-tarefas"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="projetos"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="criar-tarefa"
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="perfil" options={{ href: null }} />
    </Tabs>
  );
}
