import { auth } from '$lib/auth';

const constructCookies = (session) => {
    return {
        refresh_token: `refresh_token=${session.refresh_token};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${60 * 60 * 24 * 180};`,
        access_token: `access_token=${session.access_token};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${session.expires_in};`,
        expires_at: `expires_at=${session.expires_at};Path=/;HttpOnly;Secure;SameSite=Strict;Max-Age=${60 * 60 * 24 * 180};`,
    };
};

export async function post({ request }) {
    const body = await request.formData();

    const email = body.get("email");
    const password = await body.get("password");

    let { user, session, error } = await auth.signIn({ email, password });

    if (error) {
        console.log('error login:', error);
        return {
            status: error.status,
            body: {
                message: error.message,
            },
        };
    }

    console.log(">>> user:", user);

    let { refresh_token, access_token, expires_at } = constructCookies(session);
    console.log('access_token', access_token);
    return {
        status: 200,
        headers: {
            "set-cookie": [refresh_token, access_token, expires_at]
        },
        body: {
            user: user
        }
    };
}