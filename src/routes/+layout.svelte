<script>
	import favicon from '$lib/assets/favicon.svg';
	import './styles/style.css'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<nav class="navbar navbar-expand-lg navbar-light bg-light"><a class="navbar-brand" href="/"><img src="/images/logo/carhub_logo.png" alt="CarHub Logo" class="logo" width=100 height=100></a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Search</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Top Listing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/cars">My Cars</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Login</a>
      </li>
    </ul>
  </div>
</nav>

{@render children()}
