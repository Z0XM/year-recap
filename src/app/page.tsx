import { redirect } from 'next/navigation';

/**
 * [Server Rendered Page]
 * [Path: /]
 *
 * static redirect to login page.
 *
 */
export default async function Page() {
	// TODO: Add a hero element with a login page redirect
	redirect('/p/login');
}
