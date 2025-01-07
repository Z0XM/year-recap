import * as Model from '@/lib/type-definitions/models';
import { create } from 'zustand';

export interface AuthState {
	user: Model.User | null;
	login: (user: Model.User) => void;
	logout: () => void;
	updateProfile: (user: Partial<Pick<Model.User, 'avatar' | 'display_name' | 'accent_color'>>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	login: (user) => set({ user }),
	logout: () => set({ user: null }),
	updateProfile: (user) =>
		set((state) => {
			if (!state.user) return {};
			return {
				user: {
					...state.user,
					avatar: user.avatar ?? state.user.avatar,
					display_name: user.display_name ?? state.user.display_name,
					accent_color: user.accent_color ?? state.user.accent_color
				}
			};
		})
}));
