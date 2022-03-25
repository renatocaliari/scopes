<script lang="ts">
    import { notificationData } from '$lib/stores/notificationStore';
    import { scale } from 'svelte/transition';
    import { onMount } from 'svelte';
</script>

<div class="container" transition:scale|local={{ start: 0.7, delay: 500 }}>
    {#if user.id}
        <h1>
            {user.full_name ? user.full_name : user.username} profile
        </h1>
    {/if}

    <div class="user" transition:scale|local={{ start: 0.2 }}>
        <div class="text">
            <input
                aria-label="User's full name"
                type="text"
                placeholder="User's full name"
                name="full_name"
                value={user.full_name}
            />
            <button class="save" aria-label="Save user's full name" on:click={(e) => triggerUpdate(e)} />
        </div>
    </div>
    <div class="user" transition:scale|local={{ start: 0.3 }}>
        <div class="text">
            <input
                aria-label="User's username"
                type="text"
                placeholder="User's username"
                name="username"
                value={user.username}
            />
            <button class="save" aria-label="Save user's username" on:click={(e) => triggerUpdate(e)} />
        </div>
    </div>
    <div class="user" transition:scale|local={{ start: 0.4 }}>
        <div class="text">
            <input
                aria-label="User's email"
                placeholder="User's email"
                type="email"
                name="email"
                value={user.email}
            />
            <button class="save" aria-label="Save user's email" on:click={(e) => triggerUpdate(e)} />
        </div>
    </div>
    <div class="user" transition:scale|local={{ start: 0.5 }}>
        <div class="text">
            <input
                aria-label="User's bio"
                placeholder="User's bio"
                type="text"
                name="bio"
                value={user.bio}
            />
            <button class="save" aria-label="Save user's bio" on:click={(e) => triggerUpdate(e)} />
        </div>
    </div>
    <div class="user" transition:scale|local={{ start: 0.6 }}>
        <div class="text">
            <input
                aria-label="User's date of birth"
                type="date"
                name="birth_date"
                placeholder="User's date of birth"
                value={user.birth_date}
            />
            <button
                class="save"
                aria-label="Save user's date of birth"
                on:click={(e) => triggerUpdate(e)}
            />
        </div>
    </div>
</div>