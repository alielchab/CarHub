
import db from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get('username');
    const password = data.get('password');

    const user = await db.getUserByUsername(username);

    if (!user || user.password !== password) {
      return fail(400, {
        error: 'Benutzername oder Passwort ist falsch.'
      });
    }

    cookies.set('session', user._id.toString(), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 60 * 60 * 24
    });

    throw redirect(303, '/cars');
  }
};