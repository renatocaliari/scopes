<script context="module">
    export async function load({ params, fetch, session, stuff }) {
        console.log('fetching external api...')
        const response = await fetch("https://api.yourapp.com/");
        console.log('response: ', response)
        
        return {
            status: response.status,
        }
    }
</script>


