import { auth } from '$lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function post({ request }) {
    const body = await request.formData();
    console.log('body entries', [...body.entries()]);

    const email = body.get("email");
    const password = body.get("password");
    const confirmPassword = body.get("confirmPassword");
    const username = uuidv4();

    console.log('password:', password);
    console.log('confirm password:', confirmPassword);
    let validationError = {};
    if (password !== confirmPassword) {
        validationError.password = "Password and confirm password does not match"
    }


    if (Object.keys(validationError).length > 0) {
        return {
            status: 405,
            body:
            {
                message: "SignUp failed",
                errors: validationError
            },
        };
    }

    console.log('call signup');
    const { user, error, session } = await auth.signUp({
        email,
        password: password
    }, {
        data: {
            username: username,
            avatar_url: '',
            fullname: '',
            birthdate: null,
            // Source: https://supabase.com/docs/reference/javascript/auth-update
            // User metadata: It's generally better to store user data in a table inside your public schema (i.e. public.users). Use the update() method if you have data which rarely changes or is specific only to the logged in user.
        }
    });
    console.log('signup called');

    if (error) {
        return {
            status: error.status,
            body: {
                message: error.message,
            },
        };
    } else {
        return {
            status: 200
        }
    }

}