import { get as getStore } from 'svelte/store';
import { projectStore, compare } from '$lib/stores/projectStore';


const lastIndexOf = (array, key, value) => {
    for (let i = array?.length - 1; i >= 0; i--) {
        if (array[i][key] === value) return i;
    }
    return -1;
};


export function sequenceScopes() {
    let scopesPriorized = [];
    let forkedScopes = [];
    let indexLastRisky = 0;

    let sortedScopesIndispensable = [];
    let scopesForkedPriorized = [];

    console.log('chamou a função...');
    let copyStore = JSON.parse(JSON.stringify(getStore(projectStore)));
    sortedScopesIndispensable = copyStore.filter((scope) => scope.id !== 'bucket').sort(compare);
    indexLastRisky = lastIndexOf(sortedScopesIndispensable, 'risky', true);

    scopesPriorized = [...sortedScopesIndispensable].map((scope, index) => {
        scope.order = index;
        if (!scope.risky && index <= indexLastRisky) {
            let previousId = scope.id;
            scope.id = scope.id + '-forked';
            let forkedScope = JSON.parse(JSON.stringify(scope));
            forkedScope.id = previousId;
            forkedScopes = [...forkedScopes, forkedScope];
        }
        return scope;
    });

    let scopesBeforeLastRisky = scopesPriorized.slice(0, indexLastRisky + 1);
    let scopesAfterLastRisky = scopesPriorized.slice(indexLastRisky + 1);
    scopesAfterLastRisky = scopesAfterLastRisky.concat(forkedScopes);
    scopesAfterLastRisky.sort(compare);

    scopesPriorized.splice(indexLastRisky + 1, 0, scopesAfterLastRisky);

    scopesAfterLastRisky
    scopesForkedPriorized = scopesBeforeLastRisky.concat(scopesAfterLastRisky);

    return {
        sortedScopesIndispensable: sortedScopesIndispensable,
        scopesForkedPriorized: scopesForkedPriorized
    }
};

