import dotenv from 'dotenv'
dotenv.config()
export let env = process.env;


export function getSession(event) {
}

export async function externalFetch(request) {
}


export const handle = async ({ event, resolve }) => {

  let response = await resolve(event, {
    ssr: true,
  });
  return response;
};