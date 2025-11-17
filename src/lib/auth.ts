"use server";

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'swalaxon_session';
const sessionSecret = process.env.SESSION_SECRET || 'default-secret-for-dev-use-a-real-one-in-prod';

// This is a simplified session management for demonstration.
// In a production application, use a robust library like next-auth or iron-session.

async function sign(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(sessionSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
    return Buffer.from(signature).toString('hex');
}

async function verify(value: string, signature: string): Promise<boolean> {
    const expectedSignature = await sign(value);
    return expectedSignature === signature;
}


export async function createSession(data: string) {
    const signature = await sign(data);
    const cookieValue = `${data}.${signature}`;
    cookies().set(SESSION_COOKIE_NAME, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
}

export async function getSession() {
    const cookieValue = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!cookieValue) return null;

    const [data, signature] = cookieValue.split('.');
    if (!data || !signature) return null;

    const isValid = await verify(data, signature);
    if (!isValid) return null;

    return data;
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
