
import { writable, get, derived } from "svelte/store"
import ScopeItem from "$lib/classes/ScopeItem";
import { persistentWritable } from "$lib/stores/persistentStore";
import { SvelteComponentDev } from "svelte/internal";

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

// export let projectStore = localStorageStore('projectStore', scopes);

export const projectStore = ProjectStore(true, 9, false);

// console.log('projectStore:', get(projectStore));

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
                        // indispensable = true;
                        break;
                    case 5:
                        risky = true;
                        break;
                    case 6:
                        dependsOn = ['scope-1'];
                        // indispensable = true;
                        break;
                    default:
                        break;
                }
            }
            addScopeAutoId('', items, dependsOn, risky, indispensable);
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
            placeholder: "Scope " + get(store).length,
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

    function filterScopesWithItemsExcludingThisAndBucket(currentScope) {
        return get(store).filter((scope) => scope.id != currentScope.id && scope.id !== "bucket" && scope.items.length > 0);
    }

    function filterScopes(fn) {
        return get(store).filter(fn);
    }

    function updateDependencies(scope, checkedScope, checked) {
        console.log('checkedScope.dependsOn:', checkedScope.dependsOn);

        if (!checkedScope.dependsOn.includes(scope.id)) {
            console.log('vai dar update');
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
        } else {
            console.log('não vai dar update');
        }
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

    function scopeRemoveItem(scope, item) {
        update(scopes =>
            scopes.find((s) => s.id === scope.id)
                .items.filter((i) => i.id !== item.id));
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


    function merge(left, right, originalArr) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {
            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
            } else if (left[0].risky && !right[0].risky) {
                sortedArr.push(left.shift());
            } else if (!left[0].risky && right[0].risky) {
                sortedArr.push(right.shift());
            } else if (left[0].dependsOn?.length > right[0].dependsOn?.length) {
                sortedArr.push(left.shift());
            } else if (left[0].dependsOn?.length < right[0].dependsOn?.length) {
                sortedArr.push(right.shift());
            } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length > originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                sortedArr.push(left.shift());
            } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length < originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                sortedArr.push(right.shift());
            } else {
                sortedArr.push(right.shift());
            }
        }
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }

    function mergeSort(arr, originalArr = []) {
        if (originalArr.length === 0) {
            originalArr = JSON.parse(JSON.stringify(arr));
        }
        // the base case is array length <=1
        if (arr.length <= 1) {
            return arr;
        }
        const half = arr.length / 2;
        const left = arr.splice(0, half); // the first half of the array
        const right = arr;
        return merge(mergeSort(left, originalArr), mergeSort(right, originalArr), originalArr);
    }

    function sortScopesByPriority() {
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1
        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071


        const sortedScopesIndispensable = derived(store, (s) => {
            let copyFilteredStore = JSON.parse(JSON.stringify(s.filter((scope) => scope.id !== 'bucket')));
            return mergeSort(copyFilteredStore);
        });

        const scopesForkedPriorized = derived(sortedScopesIndispensable, (s) => {
            let scopesPriorized = [];
            let forkedScopes = [];
            let indexLastRisky = 0;

            indexLastRisky = lastIndexOf(get(sortedScopesIndispensable), 'risky', true);
            scopesPriorized = JSON.parse(JSON.stringify(s)).map((scope, index) => {
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
            scopesAfterLastRisky = mergeSort(scopesAfterLastRisky);

            scopesPriorized.splice(indexLastRisky + 1, 0, scopesAfterLastRisky);

            scopesAfterLastRisky
            return scopesBeforeLastRisky.concat(scopesAfterLastRisky);
        });


        return {
            sortedScopesIndispensable: get(sortedScopesIndispensable),
            scopesForkedPriorized: get(scopesForkedPriorized)
        }
    }

    return {
        reset: () => set([]),
        addScope,
        addBucketScope,
        addScopeAutoId,
        scopeUnlocksDependencies,
        scopeRemoveItem,
        scopeUpdateRisky,
        scopeUpdateIndispensable,
        scopeFilterItemsIndispensable,
        scopeFilterItemsNiceToHave,
        itemUpdateIndispensable,
        sortItemsByIndispensable,
        updateDependencies,
        scopeAddItem,
        sortScopesByPriority,
        filterScopes,
        filterScopesWithItemsExcludingBucket,
        filterScopesWithItemsExcludingThisAndBucket,
        set,
        update,
        subscribe
    }
};


export const lastIndexOf = (array, key, value) => {
    for (let i = array?.length - 1; i >= 0; i--) {
        if (array[i][key] === value) return i;
    }
    return -1;
};
