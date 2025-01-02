import { create } from 'zustand';

export interface AppInfo {
	dayInt: number;
	hasFilledDayForm: boolean;
	refetch: boolean;
	setDayInt: (dayInt: number) => void;
	setHasFilledDayForm: (hasFilledDayForm: boolean) => void;
	setRefetch: (refetch: boolean) => void;
}

export const useAppInfo = create<AppInfo>((set) => ({
	dayInt: 0,
	hasFilledDayForm: false,
	refetch: false,
	setDayInt: (dayInt) => set({ dayInt }),
	setHasFilledDayForm: (hasFilledDayForm) => set({ hasFilledDayForm }),
	setRefetch: (refetch) => set({ refetch })
}));
