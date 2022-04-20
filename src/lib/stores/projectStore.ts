import { derived, writable } from 'svelte/store';

import { localStorageStore } from 'fractils'
import { localStore } from '$lib/stores/localStore';
import { get } from 'svelte/store'

import Project from '$lib/classes/Project';
import Scope from '$lib/classes/Scope';

const total = 6;
// let scopes = [];

// let scope = {
//     id: 'bucket',
//     name: 'Bucket',
//     order: 0,
//     items: [],
//     dependencies: [],
//     dependents: [],
//     risky: false
// };
// scopes = [...scopes, scope];

// for (let i = 1; i <= total; i++) {
//     let scope = {
//         id: 'scope-' + i,
//         name: 'Change: Scope ' + i,
//         order: 0,
//         items: [],
//         dependencies: [],
//         dependents: [],
//         risky: false
//     };
//     scopes = [...scopes, scope];
// }


export let project = new Project();
project.addBucketScope('Bucket');
for (let i = 1; i <= total; i++) {
    project.addScopeAutoId('Change: Scope ' + i);
}

// export let projectStore = localStorageStore('projectStore', scopes);
// console.log(scopesStore);

// export let projectStore = writable(scopes);


// console.log(project);
// export let projectStore = localStorageStore('projectStore', project.scopes);

// function compare(first, second) {
//     let ret = 0;
//     if (first.risky && !second.risky && first.dependencies.includes(second.id)) {
//         ret = 1;
//     } else if (first.risky && !second.risky && !first.dependencies.includes(second.id)) {
//         ret = -1;
//     } else if (first.risky && second.risky && first.dependents.length > second.dependents.length) {
//         ret = -1;
//     } else if (
//         first.risky &&
//         second.risky &&
//         first.dependents.length === second.dependents.length &&
//         first.items.length > second.items.length
//     ) {
//         ret = -1;
//     } else if (
//         !first.risky &&
//         !second.risky &&
//         first.dependents.length > second.dependents.length
//     ) {
//         ret = -1;
//     } else if (!first.risky && !second.risky && first.dependencies.includes(second.id)) {
//         ret = 1;
//     } else if (
//         !first.risky &&
//         !second.risky &&
//         first.dependencies.length < second.dependencies.length
//     ) {
//         ret = -1;
//     } else if (
//         !first.risky &&
//         !second.risky &&
//         first.dependencies.length > second.dependencies.length
//     ) {
//         ret = 1;
//     }
//     return ret;
// }

// export const projectStoreSorted = derived(projectStore, $projectStore => $projectStore.sort(compare));

// make a copy of original store to not modify the original order
// based on this post: https://stackoverflow.com/questions/59076474/svelte-derived-stores-and-array-sort
// export const projectStoreSorted = derived(projectStore, $projectStore => [...$projectStore].sort(compare));


// export function getScope(idScope) {
//     let $projectStore = get(projectStore);
//     return $projectStore.find((scope) => scope.id === idScope);
// }



