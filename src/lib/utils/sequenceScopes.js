import { get as getStore } from 'svelte/store';
import { projectStore, compare } from '$lib/stores/projectStore';

export let sortedScopesIndispensable = [];
export let scopesForkedPriorized = [];

let scopesPriorized = [];
let forkedScopes = [];
let indexLastRisky = 0;

const lastIndexOf = (array, key, value) => {
    for (let i = array?.length - 1; i >= 0; i--) {
        if (array[i][key] === value) return i;
    }
    return -1;
};

sortedScopesIndispensable = [...getStore(projectStore)].filter((scope) => scope.id !== 'bucket').sort(compare);
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
// console.log('scopesAfterLastRisky:', scopesAfterLastRisky);
// console.log('scopesBeforeLastRisky:', scopesBeforeLastRisky);
scopesForkedPriorized = scopesBeforeLastRisky.concat(scopesAfterLastRisky);

// console.log('sortedScopesIndispensable:', sortedScopesIndispensable);
// console.log('scopesForkedPriorized:', scopesForkedPriorized);


