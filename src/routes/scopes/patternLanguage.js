import { sequenceScopes } from '$lib/utils/sequenceScopes'

export function get({ params }) {
    if (sequenceScopes().sortedScopesIndispensable) {
        return {
            body: { sortedScopesIndispensable: sequenceScopes().sortedScopesIndispensable }
        };
    }
}