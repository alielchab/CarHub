import db from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';

function requireLogin(locals) {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
}

export async function load({ locals }) {
  requireLogin(locals);

  return {
    cars: await db.getCars()
  };
}

export const actions = {
  deactivate: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateCarStatus(data.get('id'), 'inaktiv');

    throw redirect(303, '/cars');
  },

  activate: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateCarStatus(data.get('id'), 'aktiv');

    throw redirect(303, '/cars');
  },

  sold: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateCarStatus(data.get('id'), 'verkauft');

    throw redirect(303, '/cars');
  },

  remove: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateCarStatus(data.get('id'), 'entfernt');

    throw redirect(303, '/cars');
  },

  topListing: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateTopListing(data.get('id'), true);

    throw redirect(303, '/cars');
  },

  removeTopListing: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.updateTopListing(data.get('id'), false);

    throw redirect(303, '/cars');
  },

  deleteForever: async ({ request, locals }) => {
    requireLogin(locals);

    const data = await request.formData();
    await db.deleteCar(data.get('id'));

    throw redirect(303, '/cars');
  }
};