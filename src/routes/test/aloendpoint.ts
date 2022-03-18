export async function get({params}) {
    await new Promise(resolve => setTimeout(resolve, 5000));

    const user = {
                name: "Endpoint sem JSON",
    }
    return {
        body: {user}
    }
}