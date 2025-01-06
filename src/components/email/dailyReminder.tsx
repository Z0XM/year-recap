export function DailyReminderEmailTemplate(props: { webAddress: string }) {
	const { webAddress } = props;
	return (
		<div>
			<h1>Let us know how your day went!</h1>
			<h2>
				Click <a href={`${webAddress}/p/`}>here</a> to fill the form!
			</h2>
			<a href={`${webAddress}/about`}>Know more</a>
		</div>
	);
}
