import { z } from 'zod';

export const profileSettingsSchema = z
	.object({
		display_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).trim(),
		avatar: z.string().url({ message: 'Invalid URL' }).trim(),
		accent_color: z.string().trim()
	})
	.partial();

export const reminderSettingsSchema = z.object({
	enable_daily: z.boolean(),
	enable_weekly: z.boolean(),
	enable_monthly: z.boolean()
});
