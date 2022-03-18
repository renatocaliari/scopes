<script>
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { BASE_API_URI } from '$lib/utils/requestUtils';
    import { notificationData } from '$lib/stores/notificationStore';
    import { dbConnection } from '$lib/stores/dbConnection'

    let email;
    let username;
    let fullName;
    let bio;
    let password;
    let confirmPassword;
</script>

<svelte:head>
    <title>Register | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<section
    class="container"
    in:fly={{ y: 100, duration: 500, delay: 500 }}
    out:fly={{ duration: 500 }}
>
    <h1>Register</h1>
    {#if error}
        <p class="center error">{error}</p>
    {/if}
    <form class="form" method="post">>
        <input
            bind:value={email}
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            required
        />
        <input
            bind:value={username}
            type="text"
            aria-label="Username"
            placeholder="Username"
            required
        />
        <input
            bind:value={fullName}
            type="text"
            aria-label="Full name"
            placeholder="Full name"
            required
        />
        <input
            bind:value={bio}
            type="text"
            aria-label="Brief bio"
            placeholder="Tell us about yourself..."
            required
        />
        <input
            bind:value={password}
            type="password"
            name="password"
            aria-label="password"
            placeholder="password"
            required
        />
        <input
            bind:value={confirmPassword}
            type="password"
            name="confirmPassword"
            aria-label="Confirm password"
            placeholder="Confirm password"
            required
        />
        {#if confirmPassword}
            <button class="btn" type="submit">Register</button>
        {:else}
            <button class="btn" type="submit" disabled>Register</button>
        {/if}
    </form>
</section>