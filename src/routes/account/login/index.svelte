<script context="module">
        export const load = async ({ params }) => {
            console.log('>>> params:', params);
            return {
                props: params.get('redirectedFrom'),
            }
        };
</script>
<script>
    import signIn from '$lib/auth/supabase'
    let email;
    let password;
    let error;
    let redirectedFrom;

    let loading = false


  const handleLogin = async () => {
    try {
      loading = true
      const { error } = await signIn({ email, password, redirectedFrom})
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
    <title>Login | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<section
    class="container">
    <h1>Login</h1>
    {#if error}
        <p class="center error">{error}</p>
    {/if}
    <form class="form" on:submit|preventDefault={handleLogin}>
        <input
            bind:value={email}
            name="email"
            type="email"
            aria-label="Email address"
            placeholder="Email address"
        />
        <input
            bind:value={password}
            name="password"
            type="password"
            aria-label="password"
            placeholder="password"
        />
        <button class="btn" type="submit">Login</button>
        <p class="center">No account yet? <a href="/account/register">Get started</a>.</p>
    </form>
</section>