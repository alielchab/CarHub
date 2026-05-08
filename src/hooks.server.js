import db from '$lib/db.js';

export async function handle({ event, resolve }) {
  const session = event.cookies.get('session');

  if (session) {
    event.locals.user = {
      id: session
    };
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}