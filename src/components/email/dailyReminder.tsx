import * as React from 'react';

interface DailyReminderEmailTemplateProps {
	webAddress: string;
}

export const DailyReminderEmailTemplate: React.FC<Readonly<DailyReminderEmailTemplateProps>> = ({ webAddress }) => (
	<div>
		<h1>Let us know how your day went!</h1>
		<h2>
			Click <a href={`${webAddress}/p/`}>here</a> to fill the form!
		</h2>
		<a href={`${webAddress}/about`}>Know more</a>
	</div>
);
