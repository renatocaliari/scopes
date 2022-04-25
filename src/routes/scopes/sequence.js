import { sequenceScopes } from '$lib/utils/sequenceScopes'

export async function get({ params }) {
    console.log('>>>> carregou...');

    if (sequenceScopes().scopesForkedPriorized) {
        return {
            body: { scopesForkedPriorized: sequenceScopes().scopesForkedPriorized }
        };
    }
}