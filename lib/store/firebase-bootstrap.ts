import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useProjectsStore } from './projects';
import { useTasksStore } from './tasks';
import { useUsersStore } from './users';

import { subscribeAuth } from '@/lib/auth';
import { subscribeProjects } from '@/lib/projects-firestore';
import { subscribeTasks } from '@/lib/tasks-firestore';
import { subscribeUsers } from '@/lib/users-firestore';

type BootstrapState = {
  initializing: boolean;
};

// Conecta Firebase Auth + 3 collections do Firestore (users, projects, tasks)
// aos stores Zustand. RNFirebase é nativo-only — na web, os subscribes nem
// tentam rodar (UI continua acessível, mas Firebase fica inerte).
//
// Try/catch defensivo pra que falha de qualquer subscribe não congele o app —
// cai pra "ready=true" e a UI segue (com aquele recurso indisponível).
export function useFirebaseBootstrap(): BootstrapState {
  const setUsers = useUsersStore((s) => s.setUsers);
  const setCurrentUser = useUsersStore((s) => s.setCurrentUser);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const setTasks = useTasksStore((s) => s.setTasks);

  const isWeb = Platform.OS === 'web';
  const [authReady, setAuthReady] = useState(isWeb);
  const [usersReady, setUsersReady] = useState(isWeb);
  const [projectsReady, setProjectsReady] = useState(isWeb);
  const [tasksReady, setTasksReady] = useState(isWeb);

  useEffect(() => {
    if (isWeb) return;

    const unsubs: Array<() => void> = [];

    try {
      unsubs.push(
        subscribeAuth((user) => {
          setCurrentUser(user?.uid ?? '');
          setAuthReady(true);
        }),
      );
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeAuth falhou:', e);
      setAuthReady(true);
    }

    try {
      unsubs.push(
        subscribeUsers((users) => {
          setUsers(users);
          setUsersReady(true);
        }),
      );
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeUsers falhou:', e);
      setUsersReady(true);
    }

    try {
      unsubs.push(
        subscribeProjects((projects) => {
          setProjects(projects);
          setProjectsReady(true);
        }),
      );
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeProjects falhou:', e);
      setProjectsReady(true);
    }

    try {
      unsubs.push(
        subscribeTasks((tasks) => {
          setTasks(tasks);
          setTasksReady(true);
        }),
      );
    } catch (e) {
      console.warn('[firebase-bootstrap] subscribeTasks falhou:', e);
      setTasksReady(true);
    }

    return () => unsubs.forEach((u) => u());
  }, [isWeb, setCurrentUser, setUsers, setProjects, setTasks]);

  return { initializing: !authReady || !usersReady || !projectsReady || !tasksReady };
}
