<script>
  let { form } = $props();
</script>

<div class="container">
  <h1>Login</h1>

  <p>Nur der Administrator-Login ist vorhanden und berechtigt, sich im System anzumelden.
    Es gibt keine Möglichkeit, einen neuen Benutzer zu registrieren. Bitte verwenden Sie die folgenden Anmeldedaten:
  </p>
  <p>
    Benutzername <code>admin</code> und Passwort <code>Projekt_2026</code>.
  </p>

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