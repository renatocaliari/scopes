import { writable, get, derived } from "svelte/store"
import Scope from "$lib/classes/Scope";
import ScopeItem from "$lib/classes/ScopeItem";
import { localStorageStore } from 'fractils'


// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

// export let projectStore = localStorageStore('projectStore', scopes);

export const projectStore = ProjectStore(true, 6, true);

function ProjectStore(hasBucket, totalScopes, sampleData) {
    let store = writable([]);
    const { set, subscribe, update } = store;

    if (hasBucket) {
        addBucketScope('Bucket');
    }
    for (let i = 1; i <= totalScopes; i++) {
        let items = [];
        let dependsOn = [];
        let risky = false;
        if (sampleData) {
            console.log('sample data');

            items = [ScopeItem.createItem("item1"), ScopeItem.createItem("item2")];
            switch (i) {
                case 1:
                    dependsOn = ['scope-3'];
                    break;
                case 2:
                    dependsOn = ['scope-6', 'scope-1', 'scope-3'];
                    break;
                case 3:
                    risky = true;
                    break;
                case 4:
                    dependsOn = ['scope-5'];
                    break;
                case 5:
                    break;
                case 6:
                    dependsOn = ['scope-1'];
                    break;
                default:
                    break;
            }
        }
        addScopeAutoId('Change: Scope ' + i, 0, items, dependsOn, risky);
    }

    function addBucketScope(name, order = 0, items = [], dependsOn = [], risky = false) {
        let scope = {
            id: "bucket",
            name: name,
            order: 0,
            items: items,
            dependsOn: dependsOn,
            risky: risky
        }
        addScope(scope);
    }

    function addScopeAutoId(name, order = 0, items = [], dependsOn = [], risky = false) {
        let scope = {
            id: "scope-" + get(store).length,
            name: name,
            order: 0,
            items: items,
            dependsOn: dependsOn,
            risky: risky
        };
        addScope(scope);
    }

    function addScope(scope) {
        update(scopes => [...scopes, scope]);
    }

    function filterScopesWithItemsExcludingBucket() {
        ; return get(store).filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)
    }

    function getScopesExcludingThis(currentScope) {
        return get(store).filter((scope) => scope.id != currentScope.id && scope.id !== "bucket");
    }

    function filterScopes(fn) {
        return get(store).filter(fn);
    }
    function sortScopes() {
        return get(store).sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
        });
    }

    function updateDependencies(scope, checkedScope, checked) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.dependsOn = s.dependsOn || [];
                if (checked) {
                    s.dependsOn = [...new Set([...s.dependsOn, checkedScope.id])];
                } else {
                    s.dependsOn = s.dependsOn.filter((id) => id !== checkedScope.id);
                }
            }
            return s;
        }));
    }

    function scopeUpdateRisky(scope, risky) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.risky = risky;
            }
            return s;
        }));
    }

    function itemUpdateNiceToHave(scope, item, niceToHave) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items.map((i) => {
                    if (i.id === item.id) {
                        i.niceToHave = niceToHave;
                    }
                });
            }
            return s;
        }));
    }

    function scopeAddItem(scope, name, description) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items = [...s.items, new ScopeItem(name, description)];
            }
            return s;
        }));
    }

    function scopeUnlocksDependencies(scope) {
        let result = get(store).filter((s) => s.dependsOn.includes(scope.id));
        return result;
    };

    function scopeFilterItemsIndispensable(scope) {
        return scope.items.filter((item) => !item.niceToHave)
    }
    function scopeFilterItemsNiceToHave(scope) {
        return scope.items.filter((item) => item.niceToHave)
    }


    function sortScopesByPriority() {
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1

        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071

        // const scopesSorted = derived(store, (s) =>
        //     [...s].filter((scope) => scope.id !== 'bucket').sort(compare)
        // );

        const scopesSorted = [...get(store)].slice().filter((scope) => scope.id !== 'bucket').sort(compare)
        console.log('ordenou');

        return scopesSorted;
        // return [...get(store)].sort(compare)

    }


    return {
        reset: () => set([]),
        addScope,
        addBucketScope,
        addScopeAutoId,
        scopeUnlocksDependencies,
        scopeUpdateRisky,
        scopeFilterItemsIndispensable,
        scopeFilterItemsNiceToHave,
        itemUpdateNiceToHave,
        updateDependencies,
        scopeAddItem,
        filterScopes,
        filterScopesWithItemsExcludingBucket,
        getScopesExcludingThis,
        sortScopesByPriority,
        sortScopes,
        set,
        update,
        subscribe
    }
};

export function compare(first, second) {
    // > 0 	sort b before a
    // < 0 	sort a before b
    // === 0 	keep original order of a and b
    let ret = 0;

    if (first.risky && !second.risky && first.dependsOn.includes(second.id)) {
        ret = 1;
    } else if (first.risky && !second.risky && !first.dependsOn.includes(second.id)) {
        ret = -1;
    } else if (first.risky && second.risky && first.dependsOn.length > second.dependsOn.length) {
        ret = -1;
    } else if (
        first.risky &&
        second.risky &&
        first.dependsOn.length === second.dependsOn.length &&
        first.items.length > second.items.length
    ) {
        ret = -1;
    } else if (
        !first.risky &&
        !second.risky &&
        first.dependsOn.length > second.dependsOn.length && first.dependsOn.includes(second.id)
    ) {
        ret = 1;
    } else if (
        !first.risky &&
        !second.risky &&
        first.dependsOn.length > second.dependsOn.length && !first.dependsOn.includes(second.id)
    ) {
        ret = -1;
    } else if (!first.risky && !second.risky && first.dependsOn.includes(second.id)) {
        ret = 1;
    }
    return ret;
}

