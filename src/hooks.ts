import dotenv from 'dotenv'
dotenv.config()
export let env = process.env;

import { auth, setAuthCookie, unsetAuthCookie, refreshAccessToken, getCookie, blankCookies } from '$lib/auth';
import { page, session, navigating } from '$app/stores'

import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { browser } from '$app/env';

const ExpiryMargin = 1000;


export function getSession(event) {
  console.log(">>>> getSession:", event.locals);
  console.log(">>>> getSession:", JSON.stringify(event));

  const { user, authenticated } = event.locals;

  return {
    user,
    authenticated,
  };
}

export async function externalFetch(request) {
  console.log('>>>>>>>>>>>>>> externalFetch');
  const url = import.meta.env.VITE_BASE_API_URI_PROD;
  let newUrl = request.url;
  if (request.url.startsWith(url)) {
    console.log('>>> replacing url...')
    // clone the original request, but change the URL
    request = new Request(
      request.url.replace(url, import.meta.env.VITE_BASE_API_URI_DEV)

    );

  }
  console.log('>>> new request:', request)
  return fetch(request);
}

export const handle = async ({ event, resolve }) => {
  console.log('>>> handle');

  let cookies = cookie.parse(event.request.headers.get('cookie') || '');
  let setCookies = [];

  if (cookies.access_token || cookies.refresh_token) {
    if (cookies.expires_at < Math.floor(Date.now() / 1000) + ExpiryMargin) {
      console.log('Access token expired. Refreshing...');
      try {
        setCookies = await refreshAccessToken(cookies);
      } catch (err) {
        console.log(err);
        setCookies = blankCookies();
      }
    }
    if (cookies.userid) {
      console.log('>>> cookies.userid:', cookies.userid);
    } else {
      console.log('>>> cookies.userid: NULL');
    }

    console.log('>>> cookies.access_token:', cookies.access_token);
    const jwtPayload = cookies.access_token ? jwt.decode(cookies.access_token) : false;
    event.locals.authenticated = !!jwtPayload;
    event.locals.user = { email: jwtPayload?.email };

  }

  let response = await resolve(event);

  if (setCookies?.length > 0) {
    setCookies.forEach((cookie) => response.headers.append('set-cookie', cookie));
  }

  return response;
};
