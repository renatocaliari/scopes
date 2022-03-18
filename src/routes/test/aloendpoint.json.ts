export async function get({params}) {
    await new Promise(resolve => setTimeout(resolve, 5000));

    const user = {
                name: "Endpoint Json",
    }
    return {
        status: 200,
        accept: "application/json",
        body: {user}
    }
}