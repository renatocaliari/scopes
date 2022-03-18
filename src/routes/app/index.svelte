<script context="module">
import { navigating } from '$app/stores'
import {ProtectedPage} from '$lib/utils/requestUtils.ts';
    export async function load({ url, props, params, fetch, session, stuff }) {
        ProtectedPage(session, url.href);
        return {
            status: 200,
        };
    }
</script>

Página protegida por login