import { refreshAccessToken, auth, getCookie, blankCookies } from '$lib/auth/supabase';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

const ExpiryMargin = 1000;


export function getSession(event) {
  console.log(">>>> getSession");

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
