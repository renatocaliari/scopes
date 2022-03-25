<script lang="ts">

    import { page, session } from '$app/stores';

</script>

<header>

    <nav>
        <ul>
            <li class:active={$page.url.pathname === '/'}>
                <a sveltekit:prefetch href="/">Home</a>
            </li>
            {#if (!$session || !$session.authenticated)}
                <li class:active={$page.url.pathname === '/accounts/login'}>
                    <a sveltekit:prefetch href="/account/login">Login</a>
                </li>
                <li class:active={$page.url.pathname === '/accounts/register'}>
                    <a sveltekit:prefetch href="/account/register">Register</a>
                </li>
            {:else}
                <li>
                    Welcome, <a sveltekit:prefetch href="/account/user/">{$session.user.email}</a>
                </li>
                <li>
                    <a href="/account/logout" style="cursor: pointer;">Logout</a>
                </li>
            {/if}
        </ul>
    </nav>
</header>


<nav>
  <a href="/test/alopage1">Alo Page 1 (fetch manually)</a>
  <a sveltekit:prefetch href="/test/alopage2">Alo Page 2 (load auto)</a>
  <a href="/test/aloendpoint">Alo endpoint</a>
  <a href="/app">App Restricted</a>
  <a href="/app/externalPage">App External Page</a>
</nav>

