<script context="module">
        export const load = async ({ url }) => {
            console.log('>>> searchParams:', url.searchParams);
            return {
                props: url.searchParams.get('redirectedFrom'),
            }
        };
</script>

<script lang="ts">
    import signIn from '$lib/auth/supabase'
    import SocialLogin from '$lib/components/SocialLogin.svelte';
    import Header from '$lib/components/Header.svelte';

    
    let email;
    let password;
    let redirectedFrom;

    let loading = false


  const handleLogin = async () => {
      console.log('>>> login.handleLogin');
      loading = true
      await signIn( email, password, redirectedFrom)
      loading = false
  }

</script>

<svelte:head>
    <title>Login | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<div class="content">
  <h1>Login</h1>

  <SocialLogin />

  <form on:submit|preventDefault={handleLogin}>
    <div>
      <input
        id="email"
        type="email"
        autocomplete="email"
        placeholder="Email"
        required
        bind:value={email}
      />
    </div>
    <div>
      <input
        id="password"
        type="password"
        placeholder="Password (optional)"
        bind:value={password}
      />
    </div>

    <div>
      <button type="submit" class="submit" disabled={loading}>
        {loading ? 'Loading ...' : 'Log In'}
      </button>
    </div>

    <div>
      <a sveltekit:prefetch href="/register">No account? Register here</a>
    </div>
  </form>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }
  .submit {
    border-radius: 20px;
    border: 1px solid var(--accent-color);
    background-color: var(--accent-color);
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
  }
</style>