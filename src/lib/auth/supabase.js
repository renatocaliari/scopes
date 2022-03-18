import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import * as cookie from 'cookie';

dotenv.config();

console.log('process.env.SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('process.env.SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

console.log('db:', db);

export default db;
export const auth = db.auth;

const constructCookies = (session) => {
    return {
        refresh_token: `refresh_token=${session.refresh_token};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${60 * 60 * 24 * 180};`,
        access_token: `access_token=${session.access_token};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${session.expires_in};`,
        expires_at: `expires_at=${session.expires_at};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${60 * 60 * 24 * 180};`,
    };
};


export const signIn = async (email, password, redirectedFrom) => {
    console.log('>>> supabase.login');
    await auth.signOut();
    await unsetAuthCookie();
    goto('/');

    let { user, session, error } = await auth.signIn({ email, password });
    console.log(session);

    if (error) {
        return {
            status: 405,
            body: "Login failed",
        };
    }
    let { refresh_token, access_token, expires_at } = constructCookies(session);

    return {
        status: 302,
        body: { redirectedFrom: redirectedFrom ? redirectedFrom : "/" },
        headers: {
            "set-cookie": [refresh_token, access_token, expires_at],
            location: redirectedFrom ? redirectedFrom : "/",
        },
    };
};

export const signOut = async () => {
    await auth.signOut();
    await unsetAuthCookie();
    goto('/');
};

export async function signUp(email, password) {
    console.log('>>> signup');

    let { user, error, session } = await auth.signUp({
        email,
        password
    });

    if (error) {
        return {
            status: 405,
            body: "SignUp failed",
        };
    }


    notificationData.set('Registration successful. Login now.');
    goto('/accounts/login');
}



export const getCookie = (name, token, extra) => {
    const Blank = { path: '/', expires: new Date(0) };
    const DefaultOptions = {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 180, // default Max-Age, can be overwritten via extra
    };
    let options = { ...DefaultOptions, ...extra };

    return token ? cookie.serialize(name, token, options) : cookie.serialize(name, '', Blank);
};

export const blankCookies = () => {
    return [getCookie('refresh_token', null), getCookie('access_token', null), getCookie('expires_at', null)];
};

const setServerSession = async (event, session) => {
    console.log('Setting Server Session >>>', event, session);
    await fetch('/api/auth.json', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
    });
};

export const setAuthCookie = async (session) => {
    await setServerSession('SIGNED_IN', session);
};
export const unsetAuthCookie = async () => {
    await setServerSession('SIGNED_OUT', null);
};

// exchange the refresh token for an access token
export async function refreshAccessToken(cookies) {
    const { data, error } = await auth.api.refreshAccessToken(cookies.refresh_token);
    if (error) {
        cookies.access_token = null;
        cookies.refresh_token = null;
        cookies.expires_at = null;
        throw error;
    }

    auth.setAuth(data.access_token); //needed so that server calls are authenticated

    cookies.access_token = data.access_token;
    cookies.refresh_token = data.refresh_token;
    cookies.expires_at = data.expires_at;

    return [
        getCookie('refresh_token', data.refresh_token, { maxAge: data.expires_in }),
        getCookie('access_token', data.access_token, { maxAge: data.expires_in }),
        getCookie('expires_at', data.expires_at, { maxAge: data.expires_in }),
    ];
}

