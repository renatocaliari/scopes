import { sortedScopesIndispensable } from '$lib/utils/sequenceScopes'

export async function get({ params }) {
    if (sortedScopesIndispensable) {
        return {
            body: { sortedScopesIndispensable }
        };
    }
}