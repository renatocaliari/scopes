import { scopesForkedPriorized } from '$lib/utils/sequenceScopes'

export async function get({ params }) {
    if (scopesForkedPriorized) {
        return {
            body: { scopesForkedPriorized }
        };
    }
}