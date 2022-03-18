<script lang="ts">

import { fly } from 'svelte/transition';
import {page, navigating} from '$app/stores'
import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte'
import Header from '$lib/components/Header.svelte';
import {notificationData} from '$lib/stores/notificationStore'    

import { session } from '$app/stores';
import { auth, setAuthCookie, unsetAuthCookie } from '$lib/auth/supabase';

	auth.onAuthStateChange(async (event, _session) => {
		if (event !== 'SIGNED_OUT') {
			await setAuthCookie(_session);
			session.set({ user: _session.user, authenticated: !!_session.user });
		} else {
			session.set({ user: undefined, authenticated: false });
			await unsetAuthCookie();
		}
	});
</script>

<LoadingPageProgressBar/>

<Header/>

<h1>{$page.url}</h1>


{#if $notificationData}
    <div class="notification-container">
        <p
            class="notification"
            in:fly={{ x: 200, duration: 500, delay: 500 }}
            out:fly={{ x: 200, duration: 500 }}
        >
            {$notificationData}
        </p>
    </div>
{/if}

<main>
{#if $navigating} 
    Loading... 
{:else} 
    <slot></slot> 
{/if}
</main>

<footer>
    <p>
    </p>
</footer>
