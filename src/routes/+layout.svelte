<script>
  import favicon from "$lib/assets/favicon.svg";
  import "./styles/style.css";
  import { page } from "$app/state";

  let { children, data } = $props();

  function isActive(path) {
    return page.url.pathname === path;
  }

  function isActiveStartsWith(path) {
    return page.url.pathname.startsWith(path);
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="as-navbar">
  <div class="as-left">
    <a href="/" class="as-logo">
      <img src="/images/logo/carhub_logo_transparent.png" alt="Logo" width="75" height="75" />
    </a>
    <a class:active-nav={isActive("/")} href="/">Home</a>
    <a class:active-nav={isActive("/fahrzeuge")} href="/fahrzeuge">Alle Fahrzeuge</a>
    <a class:active-nav={isActive("/toplisting")} href="/toplisting">Top Listing</a>
  </div>

  <div class="as-right">
    {#if data.user}
      <div class="user-dropdown">
        <button type="button">{data.user.username || "User"} ▾ </button>
        <div class="user-menu">
          <a href="/cars">Meine Fahrzeuge</a>

          <form method="POST" action="/logout">
            <button type="submit">Abmelden</button>
          </form>
        </div>
      </div>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </div>
</nav>

{@render children()}
