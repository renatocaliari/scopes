export async function post({ response, request }) {
    console.log('register');
    let body = await request.json();
    let session = body.session;

    if (response.status === 201) {
        notificationData.set('Registration successful. Login now.');
        goto('/accounts/login');
        console.log('body:', body);
    } else if (response.status === 400) {
        console.log(body);
    }
}

export async function get({ request }) {
    const { user, authenticated } = await request.locals;
    // refer hooks to see how this got populated
    return {
        body: { user, authenticated },
    };
}
