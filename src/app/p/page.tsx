import DailyFormPage from '@/components/DailyFormPage';
import PeopleOfToday from '@/components/PeopleOfToday';

/**
 * [Server Rendered Page]
 * [Authentication Required]
 * [Path: /p/*]
 *
 * Shows the user a form to fill for the day.
 * If the user has already filled the form, shows a message.
 *
 */
export default function Page() {
	return <DailyFormPage hasFilledFormFallback={<PeopleOfToday />} />;
}
