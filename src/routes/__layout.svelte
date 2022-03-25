<script context="module">
    import {notificationData} from '$lib/stores/notificationStore'    

    export const load = async ({ url }) => {
          return {
                props: 
                  {loggedOut: url.searchParams.get('loggedOut')},
            }
        };
</script>

<script>

    import { fly } from 'svelte/transition';
    import {page, session, navigating} from '$app/stores'

    import LoadingPageProgressBar from '$lib/components/LoadingPageProgressBar.svelte'
    import Header from '$lib/components/Header.svelte';

	import { auth, setAuthCookie, unsetAuthCookie } from '$lib/auth';
    import { browser } from '$app/env';

    export let loggedOut;

    auth.onAuthStateChange(async (event, _session) => {
        console.log('auth.state.change:', event);
        console.log('### browser:', browser);

        if (event !== 'SIGNED_OUT') {
            await setAuthCookie(_session);
            if (browser){
                session.set({ user: _session.user, authenticated: !!_session.user });
            }
        } else {
            await unsetAuthCookie();
            if (browser){
                session.set({ user: undefined, authenticated: false });
            }
        }
    });    

    const interval = setInterval(() => notificationData.set(""), 3000);
</script>

<LoadingPageProgressBar/>

<Header/>
<!-- <h2>{$page.url}</h2> -->

{#if $notificationData}
    <div class="alert shadow-lg">
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>{$notificationData}</span>
    </div>
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
