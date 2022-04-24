
import { writable, get, derived } from "svelte/store"
import ScopeItem from "$lib/classes/ScopeItem";
import { persistentWritable } from "$lib/stores/persistentStore";

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

// export let projectStore = localStorageStore('projectStore', scopes);

export const projectStore = ProjectStore(true, 6, true);
console.log('projectStore:', get(projectStore));

export function ProjectStore(hasBucket, totalScopes, sampleData) {
    let store = writable([]);
    // let store = persistentWritable("scopes", []);

    const { set, subscribe, update } = store;

    if (get(store).length === 0) {
        if (hasBucket) {
            addBucketScope('Bucket');
        }
        for (let i = 1; i <= totalScopes; i++) {
            let items = [];
            let dependsOn = [];
            let risky = false;
            let indispensable = false;
            if (sampleData) {
                items = [ScopeItem.createItem("item 1 - describing some details to break line and test limits", true), ScopeItem.createItem("item 2", true), ScopeItem.createItem("nice to have 1", false), ScopeItem.createItem("nice to have 2", false)];
                switch (i) {
                    case 1:
                        dependsOn = ['scope-3'];
                        break;
                    case 2:
                        dependsOn = ['scope-6', 'scope-1', 'scope-3'];
                        risky = true;
                        break;
                    case 3:
                        risky = true;
                        break;
                    case 4:
                        dependsOn = ['scope-5'];
                        indispensable = true;
                        break;
                    case 5:
                        break;
                    case 6:
                        dependsOn = ['scope-1'];
                        indispensable = true;
                        break;
                    default:
                        break;
                }
            }
            addScopeAutoId('Scope ' + i, items, dependsOn, risky, indispensable);
        }
    }

    function addBucketScope(name, items = [], dependsOn = [], risky = false, indispensable = false) {
        let scope = {
            id: "bucket",
            title: "",
            description: "",
            name: name,
            order: 0,
            items: items,
            dependsOn: dependsOn,
            risky: risky,
            indispensable: indispensable
        }
        addScope(scope);
    }

    function addScopeAutoId(name, items = [], dependsOn = [], risky = false, indispensable = false) {
        let scope = {
            id: "scope-" + get(store).length,
            title: "",
            description: "",
            name: name,
            order: 0,
            items: items,
            dependsOn: dependsOn,
            risky: risky,
            indispensable: indispensable
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

    function scopeUpdateIndispensable(scope, indispensable) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.indispensable = indispensable;
            }
            return s;
        }));
    }

    function itemUpdateIndispensable(scope, item, indispensable) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items.map((i) => {
                    if (i.id === item.id) {
                        i.indispensable = indispensable;
                    }
                });
            }
            return s;
        }));
    }

    function scopeAddItem(scope, name, indispensable, description) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items = [new ScopeItem(name, indispensable, description), ...s.items];
            }
            return s;
        }));
        console.log('store:', get(store));
    }

    function scopeUnlocksDependencies(scope) {
        let result = get(store).filter((s) => s.dependsOn.includes(scope.id));
        return result;
    };

    function scopeFilterItemsIndispensable(scope) {
        return scope.items.filter((item) => item.indispensable)
    }

    function scopeFilterItemsNiceToHave(scope) {
        return scope.items.filter((item) => !item.indispensable)
    }

    function sortItemsByIndispensable(scope) {
        return scope.items.sort((first, second) => {
            if (first.indispensable && !second.indispensable) {
                return -1;
            }
            if (!first.indispensable && second.indispensable) {
                return 1;
            }
            return 0;
        });
    }

    function sortScopesByPriority() {
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1

        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071

        const scopesSorted = derived(store, (s) =>
            s.filter((scope) => scope.id !== 'bucket').sort(compare)
        );

        // const scopesSorted = derived(store, (s) =>
        //     [...s].filter((scope) => scope.id !== 'bucket').sort(compare)
        // );

        // const scopesSorted = [...get(store)].slice().filter((scope) => scope.id !== 'bucket').slice().sort(compare)

        return get(scopesSorted);
        // return [...get(store)].sort(compare)

    }


    return {
        reset: () => set([]),
        addScope,
        addBucketScope,
        addScopeAutoId,
        scopeUnlocksDependencies,
        scopeUpdateRisky,
        scopeUpdateIndispensable,
        scopeFilterItemsIndispensable,
        scopeFilterItemsNiceToHave,
        itemUpdateIndispensable,
        sortItemsByIndispensable,
        updateDependencies,
        scopeAddItem,
        filterScopes,
        filterScopesWithItemsExcludingBucket,
        getScopesExcludingThis,
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
    let retFirst = -1;
    let retSecond = 1;

    // console.log('ordenando');
    // console.log('first:', first);
    // console.log('second:', second);

    if (first.dependsOn?.includes(second.id)) {
        // console.log('>>> first.dependsOn.includes(second.id)');
        // console.log('retornando o second:', second);
        // console.log('o first era:', first);
        ret = retSecond;
    } else if (second.dependsOn?.includes(first.id)) {
        // console.log('>>> second.dependsOn.includes(first.id)');
        // console.log('retornando o first:', first);
        // console.log('o second era:', second);
        ret = retFirst;
    } else if (first.risky && !second.risky) {
        // console.log('>>> second.dependsOn.includes(first.id)');
        // console.log('retornando o first:', first);
        // console.log('o second era:', second);
        ret = retFirst;
    } else if (!first.risky && second.risky) {
        // console.log('>>> first.dependsOn.includes(second.id)');
        // console.log('retornando o second:', second);
        // console.log('o first era:', first);
        ret = retSecond;
    } else if (first.dependsOn.length > second.dependsOn.length) {
        // console.log('>>> first.dependsOn.includes(second.id)');
        // console.log('retornando o second:', second);
        // console.log('o first era:', first);
        ret = retSecond;
    } else if (first.dependsOn.length < second.dependsOn.length) {
        // console.log('>>> second.dependsOn.includes(first.id)');
        // console.log('retornando o first:', first);
        // console.log('o second era:', second);
        ret = retFirst;
    }
    return ret;
}

