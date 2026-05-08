<script>
  let { form } = $props();
</script>

<div class="container">
  <h1>Login</h1>

  <form method="POST">
    <div class="mb-3">
      <label class="form-label">Benutzername</label>
      <input name="username" class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">Passwort</label>
      <input name="password" type="password" class="form-control" />
    </div>

    {#if form?.error}
      <p class="text-danger">{form.error}</p>
    {/if}

    <button class="btn btn-primary" type="submit">Login</button>
  </form>
</div>