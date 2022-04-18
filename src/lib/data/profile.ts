import type { User } from '$lib/interfaces/userInterface';
import { db, auth } from '$lib/auth';

export async function updateProfile(profile: User) {
    try {
        // const updates = {
        //     id: profile.id,
        //     email: profile.email,
        //     username: profile.username,
        //     avatar_url: profile.avatar_url,
        //     fullname: profile.fullname,
        //     birthdate: profile.birthdate === '' ? null : profile.birthdate,
        //     // updated_at: new Date(),
        // };

        // console.log('user to update :):', updates);
        console.log('user:', auth.user());

        const { user, error } = await auth.update({
            data: {
                // email: profile.email,
                username: profile.username,
                avatar_url: profile.avatar_url,
                fullname: profile.fullname,
                birthdate: profile.birthdate === '' ? null : profile.birthdate,
            },
        });
        console.log('>>> auth.ts.user:', user);


        // let { data, error } = await db.from('profiles').upsert(updates);
        // console.log('>>> auth.ts.data:', data);
        console.log("updateProfile.error:", error);

        return {
            profile: user,
            error: error,
        }
    } catch (error) {
        return error;
    }
};

export async function getProfile(session) {
    try {
        console.log('>>> getProfile.user', session?.user?.id);

        let { data, error, status } = await db
            .from('profiles')
            .select(`username, website, avatar_url, fullname, birthdate`)
            .eq('id', session.user.id)
            .single();

        console.log('data:', data);
        console.log('error:', error);
        if (error && status !== 406) {
            throw error;
        }

        if (data) {
            const profile: User = {
                id: session.user?.id,
                email: session.user?.email,
                username: data?.username,
                website: data?.website,
                avatar_url: data?.avatar_url,
                fullname: data?.fullname,
                birthdate: data?.birthdate,
            }
            console.log('>>> profile:', profile)
            return profile;
        }
    } catch (error) {
        console.log('getProfile.catch error', error.message);
    }
};

export async function getProfileById(userId) {
    try {
        if (!userId) {
            throw new Error("getProfileById: userId is null");
        }
        let { data, error, status } = await db
            .from('profiles')
            .select(`username, email, website, avatar_url, fullname, birthdate`)
            .eq('id', userId)
            .single();

        if (error && status !== 406) {
            throw error;
        }

        if (data) {
            const profile: User = {
                id: userId,
                email: data?.email,
                username: data?.username,
                website: data?.website,
                avatar_url: data?.avatar_url,
                fullname: data?.fullname,
                birthdate: data?.birthdate,
            }
            console.log('>>> profile:', profile)
            return profile;
        }
    } catch (error) {
        console.log('getProfile.catch error', error.message);
    }
};
