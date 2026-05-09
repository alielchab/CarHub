import db from '$lib/db.js';

export async function handle({ event, resolve }) {
  const session = event.cookies.get('session');

  if (session) {
    const user = await db.getUserById(session);

    if (user) {
      event.locals.user = {
        id: user._id.toString(),
        username: user.username
      };
    } else {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}