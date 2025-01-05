import { DailyReminderEmailTemplate } from '@/components/email/dailyReminder';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
	try {
		const authHeader = req.headers.get('authorization');
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return Response.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const webAddress = process.env.NEXT_PUBLIC_WEB_ADDRESS;

		if (!webAddress) {
			return Response.json({ error: 'Web Address Not found' }, { status: 500 });
		}

		const supabase = await createClient();

		// Resend has a limit of 100 emails per day
		const usersToSendFromDB = await supabase
			.from('users')
			.select('display_name, email, user_reminder_settings(enable_daily)')
			.eq('isActive', true)
			.eq('user_reminder_settings.enable_daily', true)
			.limit(100);

		if (usersToSendFromDB.error) {
			return Response.json({ error: usersToSendFromDB.error }, { status: 500 });
		}

		const emailResponse = await resend.emails.send({
			from: 'nopreply@howwasyourday.in',
			to: usersToSendFromDB.data.map((x) => x.email),
			// to: ['z0xm.dev@gmail.com'],
			subject: 'How was your day ?',
			react: await DailyReminderEmailTemplate({ webAddress }),
			// headers: {
			// 	'List-Unsubscribe': '/profile'
			// },
			scheduledAt: 'today at 8pm IST'
		});

		if (emailResponse.error) {
			return Response.json({ error: emailResponse.error }, { status: 500 });
		}

		return Response.json({ users: usersToSendFromDB.data, count: usersToSendFromDB.data?.length });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}
