import { browser, dev } from '$app/env';
import { goto } from '$app/navigation';

export const BASE_API_URI = dev ? import.meta.env.DEV
	: import.meta.env.VITE_BASE_API_URI_PROD;


export async function ProtectedPage(session, nextUrl) {
	if (!session.user) {
		await goto('/account/login?redirectedFrom=' + nextUrl);
	}
};

export const browserGet = (key: string): string | undefined => {
	if (browser) {
		const item = localStorage.getItem(key);
		if (item) {
			return item;
		}
	}
	return null;
};

export const browserSet = (key: string, value: string): void => {
	if (browser) {
		localStorage.setItem(key, value);
	}
};
