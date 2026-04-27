import { useEffect, useState } from 'react';

import { useProjectsStore } from './projects';
import { useTasksStore } from './tasks';
import { useUsersStore } from './users';

export async function resetAllStores(): Promise<void> {
  await Promise.all([
    useUsersStore.persist.clearStorage(),
    useProjectsStore.persist.clearStorage(),
    useTasksStore.persist.clearStorage(),
  ]);
  useUsersStore.getState().reset();
  useProjectsStore.getState().reset();
  useTasksStore.getState().reset();
}

export function useStoresHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useUsersStore.persist.hasHydrated() &&
    useProjectsStore.persist.hasHydrated() &&
    useTasksStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;
    const check = () => {
      if (
        useUsersStore.persist.hasHydrated() &&
        useProjectsStore.persist.hasHydrated() &&
        useTasksStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    };
    const unsubs = [
      useUsersStore.persist.onFinishHydration(check),
      useProjectsStore.persist.onFinishHydration(check),
      useTasksStore.persist.onFinishHydration(check),
    ];
    check();
    return () => unsubs.forEach((u) => u());
  }, [hydrated]);

  return hydrated;
}
