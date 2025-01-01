export default async function HowPage() {
	return (
		<div className='p-4'>
			<span className='text-xl'>What is all this ?</span>
			<ul>
				<li>
					<span className='text-yellow-400'> What?: </span> We collect different types data on daily, weekly, monthly
					basis.
				</li>
				<li>
					<span className='text-yellow-400'> Why?: </span>We analyze, prepare and format the data into a beautiful
					digital/physical recap of your year.
				</li>
				<li>
					<span className='text-yellow-400'> What if you forget or or don&apos;t feel like it? </span>
					We will remind you to fill the form. If you don&apos;t feel like it, you can skip it. We will use mathematical
					techniques to overcome data issues. Though there would be some minimum data limits to have a presentable year
					Recap.
				</li>
				<li>
					<span className='text-yellow-400'>Dev Notes: </span>
					<ol>
						<li>This was built in 4 hours on 1st Jan. So code is rushed but functional</li>
						<li>We will be developing on this project on weekly basis</li>
						<li>The repo will be open sourced for contributions once execution is stable</li>
						<li>Sensitive and personal data would be hidden from the team till the final stage of the recap.</li>
						<li>We will take in your suggestions and ideas soon.</li>
						<li>Photos/Videos would soon be supported</li>
						<li>You would be able to view your submitted data soon.</li>
						<li>General Tech and UI of the app would be improved soon.</li>
					</ol>
				</li>
			</ul>
		</div>
	);
}
