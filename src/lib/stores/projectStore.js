
import { get, writable } from "svelte/store"
import ScopeItem from "$lib/classes/ScopeItem";
import { dev } from '$app/env';

//do
// import { persistentWritable } from "$lib/stores/persistentStore";
import { v4 as uuidv4 } from 'uuid';

import { localStorageStore } from 'fractils'

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

// let store = localStorageStore("scopes", []);
let store = writable([]);

export let projectStore = ProjectStore();
// export let sortedGroupedScopes = localStorageStore('scopesSorted', []);
// export let sortedGroupedAndForkedScopes = localStorageStore('groupedAndForkedScopes', []);
// export let sortedScopesDocumentation = localStorageStore('scopesSortedDocumentation', []);
export let sortedGroupedScopes = writable([]);
export let sortedGroupedAndForkedScopes = writable([]);
export let sortedScopesDocumentation = writable([]);

projectStore.sortScopesByPriority();



export function ProjectStore() {
    // let store = persistentWritable("scopes", []);
    // let store = localStorageStore("scopes", []);

    const { set, subscribe, update } = store;

    function reset() {
        console.log('reseting...');
        set([]);
        createInitialData(true, 9, false);
    }

    if (get(store).length === 0) {
        console.log('creating initial data')
        createInitialData(true, 9, true);
    }

    function createInitialData(hasBucket, totalScopes, sampleData, idxSample = 3) {
        console.log('store empty')
        if (hasBucket) {
            addBucketScope('Bucket');
        }
        for (let i = 1; i <= totalScopes; i++) {
            let name = "";
            let items = [];
            let dependsOn = [];
            let risky = false;
            let indispensable = false;
            if (sampleData && dev) {
                if (idxSample == 1) {
                    switch (i) {
                        case 1:
                            name = 'scope-1'
                            dependsOn = ['scope-2', 'scope-3', 'scope-4'];
                            break;
                        case 2:
                            name = 'scope-2'
                            dependsOn = [];
                            risky = true;
                            break;
                        case 3:
                            name = 'scope-3'
                            dependsOn = ['scope-2', 'scope-7'];
                            risky = true;
                            break;
                        case 4:
                            name = 'scope-4'
                            dependsOn = ['scope-3'];
                            // indispensable = true;
                            break;
                        case 5:
                            name = 'scope-5'
                            dependsOn = ['scope-6'];
                            risky = true;

                            break;
                        case 6:
                            name = 'scope-6'
                            // dependsOn = ['scope-1'];
                            // indispensable = true;
                            break;
                        case 7:
                            name = 'scope-7'
                            // indispensable = true;
                            break;
                        case 8:
                            // name = 'scope-8'
                            // indispensable = true;
                            break;
                        case 9:
                            // name = 'scope-9'
                            // indispensable = true;
                            break;
                        default:
                            break;
                    }
                } else if (idxSample == 2) {
                    switch (i) {
                        case 1:
                            name = 'scope-1'
                            dependsOn = ['scope-3'];
                            break;
                        case 2:
                            name = 'scope-2'
                            dependsOn = ['scope-1', 'scope-3'];
                            risky = true;
                            break;
                        case 3:
                            name = 'scope-3'
                            risky = true;
                            break;
                        case 4:
                            name = 'scope-4'
                            dependsOn = ['scope-5'];
                            // indispensable = true;

                            break;
                        case 5:
                            name = 'scope-5'
                            risky = true;

                            break;
                        case 6:
                            name = 'scope-6'
                            // dependsOn = ['scope-1'];
                            // indispensable = true;
                            break;
                        case 7:
                            name = 'scope-7'
                            dependsOn = ['scope-6'];
                            // indispensable = true;
                            break;
                        case 8:
                            // name = 'scope-8'
                            // indispensable = true;
                            break;
                        case 9:
                            // name = 'scope-9'
                            // indispensable = true;
                            break;
                        default:
                            break;
                    }
                } else if (idxSample == 3) {
                    switch (i) {
                        case 1:
                            name = 'scope-1'
                            dependsOn = [];
                            break;
                        case 2:
                            name = 'scope-2'
                            dependsOn = [];
                            risky = true;
                            break;
                        case 3:
                            name = 'scope-3'
                            risky = true;
                            break;
                        case 4:
                            name = 'scope-4'
                            dependsOn = ['scope-5'];
                            // indispensable = true;

                            break;
                        case 5:
                            name = 'scope-5'
                            risky = true;

                            break;
                        case 6:
                            name = 'scope-6'
                            dependsOn = ['scope-5'];
                            // indispensable = true;
                            break;
                        case 7:
                            name = 'scope-7'
                            dependsOn = ['scope-5', 'scope-6'];
                            // indispensable = true;
                            break;
                        case 8:
                            // name = 'scope-8'
                            // indispensable = true;
                            break;
                        case 9:
                            // name = 'scope-9'
                            // indispensable = true;
                            break;
                        default:
                            break;
                    }
                }
            }
            if (name) {
                items = [ScopeItem.createItem("item 1 - describing some details to break line and test limits", true), ScopeItem.createItem("item 2", true), ScopeItem.createItem("nice to have 1", false), ScopeItem.createItem("nice to have 2", false)];
            }
            addScopeAutoId(name, items, dependsOn, risky, indispensable, i);
        }
    }


    function addBucketScope(name, items = [], dependsOn = [], risky = false, indispensable = false, order = 0) {
        let scope = {
            id: "bucket",
            title: "",
            description: "",
            name: name,
            order: order,
            items: items,
            dependsOn: dependsOn,
            risky: risky,
            indispensable: indispensable,
            forkedScopeId: undefined,
            freezeOrder: false
        }
        addScope(scope);
    }

    function addScopeAutoId(name, items = [], dependsOn = [], risky = false, indispensable = false, order = 0) {
        let scope = {
            id: "scope-" + get(store).length,
            title: "",
            description: "",
            name: name,
            placeholder: "Scope " + get(store).length,
            order: order,
            items: items,
            dependsOn: dependsOn,
            risky: risky,
            indispensable: indispensable,
            forkedScopeId: undefined,
            freezeOrder: false

        };
        addScope(scope);
    }

    function addScope(scope) {
        update(scopes => {
            // console.log('scopes:', scopes, ' , scope:', scope); 
            return [...scopes, scope]
        });
    }

    function filterScopesButBucket() {
        return get(store).filter((scope) => scope.id !== 'bucket')
    }

    function filterScopesWithItemsExcludingBucket() {
        return get(store).filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)
    }

    function filterScopesWithItemsExcludingThisAndBucket(currentScope) {
        return get(store).filter((scope) => scope.id != currentScope.id && scope.id !== "bucket" && scope.items.length > 0);
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
        store = store;
        // }
    }

    function scopeUpdateRisky(scope, risky) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.risky = risky;
            }
            return s;
        }));
        store = store;
    }

    function scopeUpdateIndispensable(scope, indispensable) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.indispensable = indispensable;
            }
            return s;
        }));
        store = store;

    }

    function scopeRemoveItem(scope, item) {
        update(scopes =>
            scopes.find((s) => s.id === scope.id)
                .items.filter((i) => i.id !== item.id));
        store = store;

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
        store = store;

    }

    function scopeAddItem(scope, name, indispensable, description) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items = [new ScopeItem(name, indispensable, description), ...s.items];
            }
            return s;
        }));
        store = store;

    }

    function scopeUnlocksDependencies(scope, scopes = []) {
        if (scopes.length) {
            let forkedScope = scopes.find((s2) => s2.forkedScopeId === scope.id);
            let forkedScopeId = forkedScope ? forkedScope.id : 0;
            return scopes.filter((s) => s.dependsOn.includes(scope.id) || s.dependsOn.includes(forkedScopeId));
        } else {
            return get(store).filter((s) => s.dependsOn.includes(scope.id) && !s.forkedScopeId);
        }
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

    function sortScopesinGroupForkingByRisky(groupsScopes) {
        let indexLastRisky = 0;

        let copyGroupsScopes = JSON.parse(JSON.stringify(groupsScopes));
        let itemsRemainingOfRiskyGroups = [];
        let idxGroupRisky = 0;
        copyGroupsScopes.map((group, idx) => {
            indexLastRisky = lastIndexOf(group.items, 'risky', true);
            group.risky = indexLastRisky > -1;
            if (!group.risky) {
                idxGroupRisky = idx;
            }
            console.log('group:', idxGroupRisky);
            console.log('group obj:', group);
            let forkedScopes = generateForkingScopesBasedOnRiskyScopes(group.items, indexLastRisky, itemsRemainingOfRiskyGroups);
            group.items = group.items.filter((s) => !s.remove);

            console.log('group.items:', group.items);
            // let scopesBeforeLastRisky = group.items.slice(0, indexLastRisky + 1);
            // let scopesAfterLastRisky = group.items.slice(indexLastRisky + 1);
            // scopesAfterLastRisky = scopesAfterLastRisky.concat(forkedScopes);
            // scopesAfterLastRisky = mergeSort(mergeScopesRisky, scopesAfterLastRisky);
            // group.items = scopesBeforeLastRisky.concat(scopesAfterLastRisky);
        })

        console.log('idxGroupRisky:', idxGroupRisky);
        let groupOfItemsRemainingOfRiskyGroups = { id: -1, risky: false, items: itemsRemainingOfRiskyGroups };
        copyGroupsScopes.splice(lastIndexOf(copyGroupsScopes, 'risky', true) + 1, 0, groupOfItemsRemainingOfRiskyGroups);
        return copyGroupsScopes;
    }

    function sortScopesByPriority() {
        console.log('chamou...');
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1
        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071

        let copyFilteredStore = JSON.parse(JSON.stringify(get(store).filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)));

        let groupedScopes = groupScopes(copyFilteredStore);
        let groupedSortedScopes = mergeSort(mergeGroupScopes, groupedScopes);

        console.log('groupedSortedScopes:', groupedSortedScopes);

        let sortedScopesinGroupForkingByRisky = sortScopesinGroupForkingByRisky(groupedSortedScopes);
        let remainingItemsGroup = sortedScopesinGroupForkingByRisky.find((g) => g.id === -1);
        let splittedGroupRemainingItems = splitGroupRemainingItems(remainingItemsGroup.items);

        sortedScopesinGroupForkingByRisky = sortedScopesinGroupForkingByRisky.filter((g) => g.id !== -1).concat(splittedGroupRemainingItems);
        sortedScopesinGroupForkingByRisky = generateIdForGroups(sortedScopesinGroupForkingByRisky);

        sortedGroupedScopes.set(groupedSortedScopes);
        sortedGroupedAndForkedScopes.set(sortedScopesinGroupForkingByRisky);
        sortedScopesDocumentation.set(mergeSort(mergeScopes, copyFilteredStore));

        console.log('>>>> sortedGroupedAndForkedScopes:', get(sortedGroupedAndForkedScopes));
        // console.log('splittedGroupRemainingItems:', splittedGroupRemainingItems);

        // console.log('>>>> sortedScopesDocumentation:', get(sortedScopesDocumentation));

        return {
            sortedGroupedScopes: get(sortedGroupedScopes),
            sortedGroupedAndForkedScopes: get(sortedGroupedAndForkedScopes),
            sortedScopesDocumentation: get(sortedScopesDocumentation)
        }
    }



    function generateForkingScopesBasedOnRiskyScopes(scopes, indexLastRisky, itemsRemainingOfRiskyGroups) {
        let forkedScopes = [];
        let scopesGroupedInRisky = []

        scopes.map((scope, index) => {
            scope.order = index;
            // console.log('scopes[indexLastRisky]):', scopes[indexLastRisky]);
            // console.log('scope:', scope);

            if (index <= indexLastRisky) {
                scopesGroupedInRisky.push(scope);
                let previousId = scope.id;
                if (!scope.risky) {
                    let forkedScope = JSON.parse(JSON.stringify(scope));
                    forkedScope.id = previousId;
                    forkedScopes = [...forkedScopes, forkedScope];
                    scope.forkedScopeId = scope.id;

                    let scopeRandomId = uuidv4();
                    scope.id = scope.id + '-' + scopeRandomId;
                }
                scope.freezeOrder = true;
            } else if (scopesGroupedInRisky.some((s) => scope.dependsOn.includes(s.id))) {
                itemsRemainingOfRiskyGroups.push(scope);
                scope.remove = true;
                // scope.freezeOrder = true;
            } else {
                scope.freezeOrder = false;
            }
            return scope;
        });

        forkedScopes.map((s) => {
            itemsRemainingOfRiskyGroups.push(s);
            s.remove = true
        });

        console.log('forkedScopes:', forkedScopes);
        updateDependenciesOfScopesGeneratedByFork(scopes);

        return forkedScopes;
    }


    function updateDependenciesOfScopesGeneratedByFork(scopes) {
        return scopes.filter((scope) => scope.freezeOrder).map((scope, index) => {
            if (scopes[index + 1]) {
                let indexDependsOn = scopes[index + 1]?.dependsOn?.indexOf(scope.forkedScopeId);
                if (indexDependsOn > -1) {
                    scopes[index + 1].dependsOn[indexDependsOn] = scope.id;
                }
            }
        });

    }

    const lastIndexOf = (array, key, value) => {
        for (let i = array?.length - 1; i >= 0; i--) {
            if (array[i][key] === value) return i;
        }
        return -1;
    };



    function splitGroupRemainingItems(group) {
        console.log('groupScopes(group):', groupScopes(group));
        return groupScopes(group);
    }


    function generateIdForGroups(groups) {
        console.log('id groups:', groups);
        let newArrGroups = JSON.parse(JSON.stringify(groups));
        newArrGroups.forEach((g, idx) => {
            // let groupRandomId = uuidv4();
            g.id = idx + 1;
        });
        console.log('newArrGroups:', newArrGroups);
        return newArrGroups;
    }

    function groupScopes(inputArr) {
        // copied from: https://stackoverflow.com/questions/41669281/group-array-by-nested-dependent-array-element
        // make matrix graph
        inputArr = JSON.parse(JSON.stringify(inputArr));
        var map = {};
        for (var i = 0; i < inputArr.length; i++) {
            var scope = inputArr[i];
            map[scope.id] = map[scope.id] || {};
            for (var j = 0; j < scope.dependsOn?.length; j++) {
                var dependId = scope.dependsOn[j];
                map[dependId] = map[dependId] || {};
                map[scope.id][dependId] = true;
                map[dependId][scope.id] = true;
            }
        }

        var groupsScopes = [];

        for (var key in map) {
            var group = groupsScopes.filter(function (e) {
                return e.indexOf(key) >= 0;
            })[0];


            if (!group) {
                group = [key];
                // console.log('......key:', key);
                groupsScopes.push(group);
                // console.log('group:', group);
                // console.log('groupsScopes:', groupsScopes);
            }

            for (var dependKey in map[key]) {
                if (group.indexOf(dependKey) == -1) {
                    // console.log('......dependkey:', dependKey);
                    group.push(dependKey);
                }
            }
        }

        console.log('......groupsScopes:', JSON.parse(JSON.stringify(groupsScopes)));

        var idx = 0;
        var result = groupsScopes.map(function (group) {
            let dependencyPackage = false;
            let risky = false;

            var scopes = [];
            group.forEach(function (id) {
                var scope = inputArr.filter(function (e) {
                    return e.id == id;
                })[0];
                if (scope) {
                    scopes.push(scope);
                }
            });

            if (typeof group.risky === "undefined") {
                risky = false;
            }

            if (scopes.length > 1) {
                dependencyPackage = true;
            } else {
                dependencyPackage = false;
            }
            idx++;
            return { risky: risky, dependencyPackage: dependencyPackage, items: mergeSort(mergeScopesRisky, scopes) };
        });

        console.log('......groupsScopes:', JSON.parse(JSON.stringify(groupsScopes)));

        return result;
    }


    function mergeGroupScopes(left, right) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> left[0]:', left[0]);

            if (left[0].items.filter((scope) => scope.risky).length > right[0].items.filter((scope) => scope.risky).length) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (right[0].items.filter((scope) => scope.risky).length > left[0].items.filter((scope) => scope.risky).length) {
                sortedArr.push(right.shift());
                // console.log('} else if (!left[0].risky && right[0].risky) {');
            } else if (left[0].items.length > right[0].items.length) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (right[0].items.length > left[0].items.length) {
                sortedArr.push(right.shift());
                // console.log('} else if (!left[0].risky && right[0].risky) {');
            } else {
                sortedArr.push(right.shift());
                console.log('else');
            }
            // console.log('...:', JSON.parse(JSON.stringify(sortedArr)));

        }

        // console.log('sortedArr:', JSON.parse(JSON.stringify(sortedArr)));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }

    function mergeScopes(left, right, originalArr) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> left[0]:', left[0]);

            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
                // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
                // console.log('} else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {');
                // } else if (left[0].risky && !right[0].risky) {
                //     sortedArr.push(left.shift());
                //     // console.log('} else if (left[0].risky && !right[0].risky) {');
                // } else if (!left[0].risky && right[0].risky) {
                //     sortedArr.push(right.shift());
                //     //     // console.log('} else if (!left[0].risky && right[0].risky) {');
                // } else if (left[0].dependsOn?.length > right[0].dependsOn?.length) {
                //     sortedArr.push(left.shift());
                //     // console.log('} else if (left[0].dependsOn?.length > right[0].dependsOn?.length) {');
                // } else if (left[0].dependsOn?.length < right[0].dependsOn?.length) {
                //     sortedArr.push(right.shift());
                //     // console.log('} else if (left[0].dependsOn?.length < right[0].dependsOn?.length) {');
                // } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length > originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                //     sortedArr.push(left.shift());
                // } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length < originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                //     sortedArr.push(right.shift());
                // } else if (left[0].order > right[0].order) {
                //     sortedArr.push(right.shift());
                // } else if (right[0].order > left[0].order) {
                //     sortedArr.push(left.shift());
            } else {
                sortedArr.push(right.shift());
                console.log('else');
            }
            // console.log('...:', JSON.parse(JSON.stringify(sortedArr)));

        }

        // console.log('sortedArr:', JSON.parse(JSON.stringify(sortedArr)));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }


    function mergeScopesRisky(left, right, originalArr) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> left[0]:', left[0]);

            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
                // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
                // console.log('} else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {');
            } else if (left[0].risky && !right[0].risky) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (!left[0].risky && right[0].risky) {
                sortedArr.push(right.shift());
                //     // console.log('} else if (!left[0].risky && right[0].risky) {');
                // } else if (left[0].dependsOn?.length > right[0].dependsOn?.length) {
                //     sortedArr.push(left.shift());
                //     // console.log('} else if (left[0].dependsOn?.length > right[0].dependsOn?.length) {');
                // } else if (left[0].dependsOn?.length < right[0].dependsOn?.length) {
                //     sortedArr.push(right.shift());
                //     // console.log('} else if (left[0].dependsOn?.length < right[0].dependsOn?.length) {');
                // } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length > originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                //     sortedArr.push(left.shift());
                // } else if (originalArr.filter((scope) => scope.dependsOn.includes(left[0].id)).length < originalArr.filter((scope) => scope.dependsOn.includes(right[0].id)).length) {
                //     sortedArr.push(right.shift());
                // } else if (left[0].order > right[0].order) {
                //     sortedArr.push(right.shift());
                // } else if (right[0].order > left[0].order) {
                //     sortedArr.push(left.shift());
            } else {
                sortedArr.push(right.shift());
                console.log('else');
            }
            // console.log('...:', JSON.parse(JSON.stringify(sortedArr)));

        }

        // console.log('sortedArr:', JSON.parse(JSON.stringify(sortedArr)));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }

    function mergeSort(merger, arr, originalArr = []) {
        if (originalArr.length === 0) {
            arr = JSON.parse(JSON.stringify(arr));
            originalArr = JSON.parse(JSON.stringify(arr));
        }
        // the base case is array length <=1
        if (arr.length <= 1) {
            return arr;
        }
        const half = arr.length / 2;
        const left = arr.splice(0, half); // the first half of the array
        const right = arr;
        // console.log('left:', JSON.parse(JSON.stringify(left)));
        // console.log('right:', JSON.parse(JSON.stringify(right)));
        return merger(mergeSort(merger, left, originalArr), mergeSort(merger, right, originalArr), originalArr);
    }

    return {
        set,
        update,
        subscribe,
        reset: reset,
        createInitialData: createInitialData,
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
        filterScopesButBucket,
        filterScopesWithItemsExcludingBucket,
        filterScopesWithItemsExcludingThisAndBucket,
    }
};

