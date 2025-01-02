import { create } from 'zustand';

export interface AppInfo {
	dayInt: number;
	hasFilledDayForm: boolean;
	setDayInt: (dayInt: number) => void;
	setHasFilledDayForm: (hasFilledDayForm: boolean) => void;
}

export const useAppInfo = create<AppInfo>((set) => ({
	dayInt: 0,
	hasFilledDayForm: false,
	setDayInt: (dayInt) => set({ dayInt }),
	setHasFilledDayForm: (hasFilledDayForm) => set({ hasFilledDayForm })
}));
