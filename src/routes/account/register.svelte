<script lang="ts">
    import { goto } from '$app/navigation';
    import { notificationData } from '$lib/stores/notificationStore';


    let email;
    let username;
    let fullName;
    let bio;
    let password;
    let confirmPassword;

    let loading = false;
    let validationErrors;

    async function registerUser(event) {
        const formData = new FormData(event.target);
        
        loading = true;
        const res = await fetch("/api/account/register.json", {
            method: 'POST',
            body: formData,
        });

        if (res.status === 200) {
            $notificationData = 'Registration successful. Login now.';
            goto('/account/login');
        }

        const {message, errors} = await res.json();
        validationErrors = errors;
        console.log('msg de erro:', message);
        alert(message);

        loading = false;
    }
</script>

<svelte:head>
    <title>Register | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<div class="content">
  <h1>Register</h1>
    <form class="form" on:submit|preventDefault={registerUser}>
        <input
            bind:value={email}
            name="email"
            id="email"
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            required
        />
        <input
            bind:value={username}
            name="username"
            id="username"
            type="text"
            aria-label="Username"
            placeholder="Username"
            
        />
        <input
            bind:value={fullName}
            name="fullName"
            id="fullName"
            type="text"
            aria-label="Full name"
            placeholder="Full name"
            
        />
        <input
            bind:value={bio}
            name="bio"
            id="bio"
            type="text"
            aria-label="Brief bio"
            placeholder="Tell us about yourself..."
            
        />
        <input
            bind:value={password}
            type="password"
            name="password"
            id="password"
            aria-label="password"
            placeholder="password"
            required
        />
        <input
            bind:value={confirmPassword}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            aria-label="Confirm password"
            placeholder="Confirm password"
            required
        />
        {#if validationErrors && validationErrors.password}
            <div>{validationErrors.password}</div>
        {/if}
        {#if confirmPassword}
            <button class="btn" type="submit">Register</button>
        {:else}
            <button class="btn" type="submit" disabled>Register</button>
        {/if}
    </form>
</div>