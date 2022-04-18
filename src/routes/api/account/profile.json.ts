import { updateProfile } from '$lib/data/profile';
import type { User } from '$lib/interfaces/userInterface';

export async function post({ request }) {
    const body = await request.formData();
    // const email = body.get("email");
    // const password = body.get("password");

    console.log('>>> profile.json.ts.post request:', request);

    const user = JSON.parse(body.get("user"));
    const username = body.get("username");
    const email = body.get("email");
    const fullname = body.get("fullname");
    const birthdate = body.get("birthdate");
    const avatar_url = body.get("avatar_url");

    let profile: User = {
        id: user.id,
        email: email,
        username: username,
        fullname: fullname,
        avatar_url: avatar_url,
        birthdate: birthdate === "" ? null : birthdate,
    }

    let { profile: profiledUpdated, error: errorUpdateProfile } = await updateProfile(profile);

    if (errorUpdateProfile) {
        console.log('error updating profile:', errorUpdateProfile);
        return {
            status: errorUpdateProfile.status,
            body: {
                message: errorUpdateProfile.message,
            },
        };
    }

    // let { user, error: errorAuthUpdate } = await auth.update({
    //     data: { username: username, email: email, avatar_url: avatar_url, fullname: fullname, birthdate: birthdate }
    // })

    // if (errorAuthUpdate) {
    //     console.log('error updating user meta data:', errorAuthUpdate);
    //     return {
    //         status: errorAuthUpdate.status,
    //         body: {
    //             message: errorAuthUpdate.message,
    //         },
    //     };
    // }

    return {
        status: 200,
    }
}