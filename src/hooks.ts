import { toExpressRequest, toExpressResponse } from '$lib/http/expressify';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { getProfileById } from '$lib/data/profile';
import { auth, unsetAuthCookie } from '$lib/auth';
import { refreshAccessToken, blankCookies } from '$lib/auth';


import dotenv from 'dotenv'
dotenv.config()
export let env = process.env;


const ExpiryMargin = 1000;

export function getSession(event) {
}

export async function externalFetch(request) {
}


export const handle = async ({ event, resolve }) => {

  let response = await resolve(event);
  return response;
};