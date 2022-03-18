import { writable } from 'svelte/store';
import type { User } from '$lib/interfaces/userInterface';

export const userData = writable<User>({});