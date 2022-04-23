import { get as getStore } from 'svelte/store';
import { projectStore, ProjectStore, compare } from '$lib/stores/projectStore';

const lastIndexOf = (array, key, value) => {
    for (let i = array?.length - 1; i >= 0; i--) {
        if (array[i][key] === value) return i;
    }
    return -1;
};

export async function get({ params }) {
    let sortedScopesIndispensable = [];
    let scopesPriorized = [];
    let forkedScopes = new Set();
    let indexLastRisky = 0;

    forkedScopes = new Set();
    const projectStore = ProjectStore(true, 6, true);

    sortedScopesIndispensable = getStore(projectStore).filter((scope) => scope.id !== 'bucket').sort(compare);

    indexLastRisky = lastIndexOf(sortedScopesIndispensable, 'risky', true);

    scopesPriorized = [...sortedScopesIndispensable].map((scope, index) => {
        scope.order = index;
        if (!scope.risky && index <= indexLastRisky) {
            let previousId = scope.id;
            scope.id = scope.id + '-forked';
            let forkedScope = JSON.parse(JSON.stringify(scope));
            forkedScope.id = previousId;
            forkedScopes = new Set([...forkedScopes, forkedScope]);
        }
        return scope;
    });

    scopesPriorized.splice(indexLastRisky + 1, 0, ...forkedScopes);

    if (scopesPriorized) {
        return {
            body: { scopesPriorized }
        };
    }
}