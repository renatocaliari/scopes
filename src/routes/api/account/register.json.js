import { auth } from '$lib/auth'

export async function post({ request }) {
    const body = await request.formData();
    console.log('body entries', [...body.entries()]);

    const email = body.get("email");
    const password = body.get("password");
    const confirmPassword = body.get("confirmPassword");
    const username = body.get("username");
    const fullName = body.get("fullName");
    const bio = body.get("bio");
    const birthDate = body.get("birthDate");

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
        password
    }, {
        data: {
            username: username,
            fullname: fullName,
            bio: bio,
            birthDate: birthDate,
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