<script>
  import favicon from '$lib/assets/favicon.svg';
  import './styles/style.css';

  let { children, data } = $props();

  let userOpen = $state(false);
  let inventorsOpen = $state(false);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="as-navbar">
  <div class="as-left">
    <a href="/" class="as-logo">
      <img src="images/logo/carhub_logo_transparent.png" alt="Logo" width="75" height="75" />
     
    </a>

    <a href="/">Home</a>
    <a href="/search">Search</a>

    <div class="nav-dropdown">
      <button type="button" onclick={() => inventorsOpen = !inventorsOpen}>
        Inventors ▾
      </button>

      {#if inventorsOpen}
        <div class="small-menu">
          <a href="/inventor">All Inventors</a>
          <a href="/inventor-b">Inventor B</a>
          <a href="/inventor-d">Inventor D</a>
        </div>
      {/if}
    </div>

    <a href="/top-listing">Top Listing</a>
  </div>

  <div class="as-right">
    {#if data.user}
      <div class="user-dropdown">
        <button type="button" onclick={() => userOpen = !userOpen}>
          ◎ {data.user.username || 'User'} ▾
        </button>

        {#if userOpen}
          <div class="user-menu">
            <a href="/cars">Meine Fahrzeuge</a>

            <form method="POST" action="/logout">
              <button type="submit">Abmelden</button>
            </form>
          </div>
        {/if}
      </div>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </div>
</nav>

{@render children()}