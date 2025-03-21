import { create } from "zustand";

interface DisplayNameState {
  display_name: string | null;
  setDisplayName: (newName: string) => void;
  ip: string | null;
  setIp: (ip: string) => void;
  port: string | null;
  setPort: (port: string) => void;
}
export const useDisplayNameStore = create<DisplayNameState>((set) => ({
  display_name: null,
  setDisplayName: (newName) => set(() => ({ display_name: newName })),
  ip: null,
  setIp: (newIp) => set(() => ({ ip: newIp })),
  port: null,
  setPort: (newPort) => set(() => ({ port: newPort })),
}));
