import { localStorageStore } from 'fractils'
import { get } from 'svelte/store'

const total = 6;
let scopes = [];

let scope = {
    id: 'bucket',
    name: 'Bucket List',
    order: 0,
    items: [],
    dependencies: [],
    dependents: [],
    risky: false
};

scopes = [...scopes, scope];

for (let i = 1; i <= total; i++) {
    let scope = {
        id: 'scope-' + i,
        name: 'Change: Scope ' + i,
        order: 0,
        items: [],
        dependencies: [],
        dependents: [],
        risky: false
    };
    scopes = [...scopes, scope];
}

export let scopesStore = localStorageStore('scopesStore', scopes);

export function getScope(idScope) {
    let $scopesStore = get(scopesStore);
    let scopesFiltered = $scopesStore.filter((scope) => scope.id === idScope);
    if (scopesFiltered) {
        return scopesFiltered[0];
    }
    return {};
}



// export function getScope(idScope) {
//     let $scopesStore = get(scopesStore);
//     return $scopesStore.filter((scope) => scope.id === idScope) ? $scopesStore.filter((scope) => scope.id === idScope)[0] : {};
// }
