<script context="module">
        export const load = async ({ url }) => {
          return {
                props: 
                  {redirectedFrom: url.searchParams.get('redirectedFrom')},
            }
        };
</script>

<script>
    import SocialLogin from '$lib/components/SocialLogin.svelte';
    import { notificationData } from '$lib/stores/notificationStore';
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import { browser } from '$app/env';

    let email;
    let password;
    export let redirectedFrom;

    let loading = false

    if (browser && $session && $session.authenticated) {
      goto("/");
    }
  
    async function loginUser(data) {
      const formData = new FormData(data.currentTarget);
      console.log('formdata:', formData);
      console.log('>>> login.handleLogin');
      loading = true;
      const res = await fetch("/api/account/login.json", {
          method: 'POST',
          body: formData,
      });

      console.log('>>> fez login. status:', res.status);
      const {user, message, errors} = await res.json();
      if (res.status === 200) {
          $notificationData = 'Login successful.';
          console.log(JSON.stringify($session));

          session.set({ user: {email: user.email}, authenticated: !!user.email });
          console.log('setting session on login.loginUser ');

          // if (!password) {
          //   redirectedFrom = `${redirectedFrom}?magic_link=true`;
          // }

          if (redirectedFrom) {
            goto(redirectedFrom)
          } else{        
            goto("/");
          }

      }
      
      if (message){
        console.log('msg de erro:', message);
        alert(message);        
      }

    loading = false
  }

</script>

<svelte:head>
    <title>Login | {import.meta.env.VITE_APP_TITLE}</title>
</svelte:head>

<div class="content">
  <h1>Login</h1>

  <SocialLogin />

  <form on:submit|preventDefault={loginUser}>
    <div>
      <input
        id="email"
        name="email"
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
        name="password"
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
      <a sveltekit:prefetch href="/account/register">No account? Register here</a>
    </div>
  </form>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }
  /* .submit {
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
  } */
</style>