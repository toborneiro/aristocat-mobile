import { create } from 'zustand';

type AppState = { hasSeenBootstrap: boolean; markBootstrapSeen: () => void };

export const useAppStore = create<AppState>((set) => ({
  hasSeenBootstrap: false,
  markBootstrapSeen: () => set({ hasSeenBootstrap: true })
}));
