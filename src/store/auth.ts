import * as Model from '@/lib/type-definitions/models';
import { create } from 'zustand';

export interface AuthState {
	user: Model.User | null;
	login: (user: Model.User) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	login: (user) => set({ user }),
	logout: () => set({ user: null })
}));
