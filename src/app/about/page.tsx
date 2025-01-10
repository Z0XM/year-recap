import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';

/**
 * [Server Rendered Page]
 * [Authentication Not Required]
 * [Path: /about]
 *
 * The `AboutPage` component renders the About page of the application.
 * It includes sections such as Basics, FAQs, Philosophy, and Who are we?
 * Each section contains an accordion with multiple items providing information about the website.
 */
export default async function AboutPage() {
    return (
        <div className="flex w-screen flex-col items-center justify-center gap-4 px-4 py-2 md:px-6 md:py-4">
            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl text-primary">Basics</Label>
                <div className="w-full">
                    <Accordion className="w-full" type="multiple">
                        <AccordionItem value="1">
                            <AccordionTrigger>What is this website About ? </AccordionTrigger>
                            <AccordionContent>
                                You login. Fill a form about your day, about your week on weekends, and about your month on month ends. We
                                collect this data and plan to make a beautiful digital or physical recap of your weeks, months and finally,
                                the whole year.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2">
                            <AccordionTrigger>Why does this exist ? </AccordionTrigger>
                            <AccordionContent>This exists because of a random idea of 31st Dec 2024.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="3">
                            <AccordionTrigger>How does this work ? </AccordionTrigger>
                            <AccordionContent>
                                The data collected via your forms will be stored, analyzed and aggregated by Mathematics (not AI). We work
                                with your data to present it in various modes for you to feel amazed by it.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl text-primary">FAQs</Label>
                <div className="w-full">
                    <Accordion className="w-full" type="multiple">
                        <AccordionItem value="1">
                            <AccordionTrigger>What about data privacy ? </AccordionTrigger>
                            <AccordionContent>Data is not secured as of now. Will be encrypted soon.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2">
                            <AccordionTrigger>What if some days or weeks are missed?</AccordionTrigger>
                            <AccordionContent>
                                The design of this project is such that missing data can be adjusted by using several different modelling
                                techniques. Still, they would have limitations. They more data you provide, the better experience we can
                                curate for you.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="3">
                            <AccordionTrigger>How can I see my data ?</AccordionTrigger>
                            <AccordionContent>Currently, you cannot. But it is on our todo list.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="4">
                            <AccordionTrigger>Can I see my friends data, like a public record or something ?</AccordionTrigger>
                            <AccordionContent>
                                Currently, you cannot. In future we will plan to allow visualizations but not complete data to have a better
                                effect on personal experiences
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl text-primary">Philosophy</Label>
                <div className="w-full">
                    <Accordion className="w-full" type="multiple">
                        <AccordionItem value="1">
                            <AccordionTrigger>Why should you bother ? </AccordionTrigger>
                            <AccordionContent>
                                Basic idea of this project is to make it very easy and seamless for people to *express* their emotions and
                                daily shenanigans. This is a very basic form of journalism. We believe that this will help people to inspect
                                their lives and make better decisions by reflecting back on their days while it being very easy for them to
                                do so. And also, it is fun to see how your year went and store it as a digital or physical memory .
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="2">
                            <AccordionTrigger>Mental Health</AccordionTrigger>
                            <AccordionContent>
                                A lot of times people feel vastly complex emotions which are very true to them. But in a co-living society
                                we often fail to acknowledge that the people around us could also be going through similar or complex
                                emotions, bad days, inexpressible feelings and much more. We aim to build a platform where through
                                visualizations of data people can see, feel and express along with others.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            {/* <div className='w-full flex flex-col gap-2'>
				<Label className='text-xl text-primary'>Future Plans</Label>
				<div className='w-full'>
					<Accordion className='w-full' type='multiple'>
						<AccordionItem value='1'>
							<AccordionTrigger>What is this website About ? </AccordionTrigger>
							<AccordionContent></AccordionContent>
						</AccordionItem>
						<AccordionItem value='2'>
							<AccordionTrigger>Why does this exist ? </AccordionTrigger>
							<AccordionContent></AccordionContent>
						</AccordionItem>
						<AccordionItem value='1'>
							<AccordionTrigger>How does this work ? </AccordionTrigger>
							<AccordionContent></AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div> */}
            <div className="flex w-full flex-col gap-2">
                <Label className="text-xl text-primary">Who are we?</Label>
                <div className="w-full">
                    <Accordion className="w-full" type="multiple">
                        <AccordionItem value="1">
                            <AccordionTrigger>An effort By: Z0XM</AccordionTrigger>
                            {/* <AccordionContent></AccordionContent> */}
                        </AccordionItem>
                        <AccordionItem value="2">
                            <AccordionTrigger>Contact</AccordionTrigger>
                            <AccordionContent>z0xm.dev@gmail.com</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );

    // return (
    // 	<div className='p-4'>
    // 		<span className='text-xl'>What is all this ?</span>
    // 		<ul>
    // 			<li>
    // 				<span className='text-yellow-400'> What?: </span> We collect different types data on daily, weekly, monthly
    // 				basis.
    // 			</li>
    // 			<li>
    // 				<span className='text-yellow-400'> Why?: </span>We analyze, prepare and format the data into a beautiful
    // 				digital/physical recap of your year.
    // 			</li>
    // 			<li>
    // 				<span className='text-yellow-400'> What if you forget or or don&apos;t feel like it? </span>
    // 				We will remind you to fill the form. If you don&apos;t feel like it, you can skip it. We will use mathematical
    // 				techniques to overcome data issues. Though there would be some minimum data limits to have a presentable year
    // 				Recap.
    // 			</li>
    // 			<li>
    // 				<span className='text-yellow-400'>Dev Notes: </span>
    // 				<ol>
    // 					<li>This was built in 4 hours on 1st Jan. So code is rushed but functional</li>
    // 					<li>We will be developing on this project on weekly basis</li>
    // 					<li>The repo will be open sourced for contributions once execution is stable</li>
    // 					<li>Sensitive and personal data would be hidden from the team till the final stage of the recap.</li>
    // 					<li>We will take in your suggestions and ideas soon.</li>
    // 					<li>Photos/Videos would soon be supported</li>
    // 					<li>You would be able to view your submitted data soon.</li>
    // 					<li>General Tech and UI of the app would be improved soon.</li>
    // 				</ol>
    // 			</li>
    // 		</ul>
    // 	</div>
    // )
}
