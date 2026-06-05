import db from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import { deleteCloudinaryImage } from '$lib/server/cloudinary.js';

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
    const id = data.get('id');

    const car = await db.getCar(id);

    if (car?.images?.length) {
      for (const image of car.images) {
        if (typeof image === 'object' && image.publicId) {
          await deleteCloudinaryImage(image.publicId);
        }
      }
    }

    await db.deleteCar(id);

    throw redirect(303, '/cars');
  }
};