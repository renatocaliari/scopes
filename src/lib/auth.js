import { get } from 'svelte/store'
import { goto } from '$app/navigation';
import { dev } from '$app/env';
import * as cookie from 'cookie';

import { createClient } from '@supabase/supabase-js'

console.log('>>>> supabase');
const SUPABASE_URL = "https://mhojguuespijjibpuikv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ob2pndXVlc3BpamppYnB1aWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDczNDI3MDIsImV4cCI6MTk2MjkxODcwMn0.LuV6RVNbeGgM3UuxyV_v8fnp7RA6zhkQQeb3E6CM_DU";

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const auth = db.auth;

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
    const BASE_API_URL = dev ? import.meta.env.VITE_BASE_API_URI_DEV : import.meta.env.VITE_BASE_API_URI_PROD;
    await fetch(BASE_API_URL + '/api/auth.json', {
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

