import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { Colors, FontSize, FontWeight, LetterSpacing } from '@/constants/theme';
import { useUsersStore } from '@/lib/store/users';

export default function AdminTabsLayout() {
  // Guard: se não está logado, manda pra login.
  // Cobre o caso do logout — quando currentUserId vira '', este layout
  // re-renderiza e o Redirect dispara automaticamente.
  const currentUserId = useUsersStore((s) => s.currentUserId);
  if (!currentUserId) {
    return <Redirect href="/(auth)/login" />;
  }

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
        name="projetos"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tarefas"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="aprovacoes"
        options={{
          title: 'Aprovações',
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="perfil" options={{ href: null }} />
      <Tabs.Screen name="criar-usuario" options={{ href: null }} />
      <Tabs.Screen name="criar-projeto" options={{ href: null }} />
      <Tabs.Screen name="criar-tarefa" options={{ href: null }} />
    </Tabs>
  );
}
