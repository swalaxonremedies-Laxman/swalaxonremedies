"use server";

import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(prevState: { error: string } | undefined, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const adminEmail = process.env.ADMIN_EMAIL || "swalaxonremedies@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "password";

  if (email === adminEmail && password === adminPassword) {
    await createSession(email as string);
    redirect('/admin');
  } else {
    return { error: 'Invalid email or password' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
