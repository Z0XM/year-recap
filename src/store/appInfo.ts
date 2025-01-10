import { create } from 'zustand';

export interface AppInfo {
    dayInt: number;
    totalFilledDays: number;
    hasFilledDayForm: boolean;
    dayMetadata: any;
    setDayInt: (dayInt: number) => void;
    setHasFilledDayForm: (hasFilledDayForm: boolean) => void;
    setTotalFilledDays: (totalFilledDays: number) => void;
    setDayMetadata: (dayMetadata: any) => void;
}

export const useAppInfo = create<AppInfo>((set) => ({
    dayInt: 0,
    totalFilledDays: 0,
    hasFilledDayForm: false,
    dayMetadata: {},
    setDayInt: (dayInt) => set({ dayInt }),
    setHasFilledDayForm: (hasFilledDayForm) => set({ hasFilledDayForm }),
    setTotalFilledDays: (totalFilledDays) => set({ totalFilledDays }),
    setDayMetadata: (dayMetadata: any) => set({ dayMetadata })
}));
