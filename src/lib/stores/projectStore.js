
import { get } from "svelte/store"
import ScopeItem from "$lib/classes/ScopeItem";
import { dev } from '$app/env';
import { writable } from 'svelte-local-storage-store'
import { deepCopy, deepFreeze } from '$lib/utils/general.js'
// import mixpanel from 'mixpanel-browser';

let mixpanel = { track: (arg) => { } };

//do
// import { persistentWritable } from "$lib/stores/persistentStore";
import { v4 as uuidv4 } from 'uuid';

// import { localStorageStore } from 'fractils'
import { convertToNumberingScheme } from "$lib/utils/general";

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

// let store = localStorageStore("scopes", []);
// let store = writable([]);

let store = writable("scopes", []);

export let projectStore = ProjectStore();
export let storeSortedGroupedSequenceScopes = writable('sortedGroupedSequenceScopes', []);
export let storeSortedScopesDocumentation = writable('sortedScopesDocumentation', []);

/**
 * @typedef {Object} Item
 * @property {string} id 
 * @property {string} placeholder 
 * @property {string} name 
 * @property {string} description 
 * @property {boolean} indispensable
 * 
 */

/**
 * @typedef {Object} Scope
 * @property {string} id 
 * @property {string} placeholder 
 * @property {string} name 
 * @property {string} title 
 * @property {string} description 
 * @property {boolean} order
 * @property {boolean} risky
 * @property {boolean} indispensable
 * @property {boolean} remove
 * @property {number} forkedScopeId
 * @property {boolean} hasForks
 * @property {[]} dependsOn
 * @property {Item[]} items
 * 
 */

/**
 * @typedef {Object} GroupScopes
 * @property {string} id 
 * @property {boolean} risky
 * @property {boolean} indispensable
 * @property {boolean} dependencyPackage
 * @property {Scope[]} items
 * @property {boolean} indispensableTasks
 * @property {boolean} order
 * 
 */

export function ProjectStore(scopesSample = []) {
    // let store = persistentWritable("scopes", []);
    // let store = localStorageStore("scopes", []);
    // console.log('store:', JSON.stringify(get(store)));

    const { set, subscribe, update } = store;

    function reset() {
        set([]);
        storeSortedGroupedSequenceScopes = writable('sortedGroupedSequenceScopes', []);
        storeSortedScopesDocumentation = writable('sortedScopesDocumentation', []);
    }

    if (scopesSample.length) {
        reset();
        scopesSample.forEach((scope) => {
            addScope(scope);
        });
    }
    else if (get(store).length === 0) {
        createInitialData(true, 9);
    }

    function createInitialData(hasBucket, totalScopes, sampleData = true, idxSample = 2) {
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
                            // risky = true;
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
                            // name = 'scope-7'
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
                if (name) {
                    items = [ScopeItem.createItem("item 1 - describing some details to break line and test limits", true), ScopeItem.createItem("item 2", true), ScopeItem.createItem("nice to have 1", false), ScopeItem.createItem("nice to have 2", false)];
                }

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
            hasForks: false,
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
            hasForks: false,

        };
        addScope(scope);
    }

    function addScope(scope) {
        update(scopes => {
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
        mixpanel.track('scope:dependencies:update');

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
        mixpanel.track('scopes:risky:update');
        store = store;
    }

    function scopeUpdateIndispensable(scope, indispensable) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.indispensable = indispensable;
            }
            return s;
        }));
        mixpanel.track('scope:indispensable:update');
        store = store;
    }

    function scopeRemoveItem(scope, item) {
        update(scopes =>
            scopes.find((s) => s.id === scope.id)
                .items.filter((i) => i.id !== item.id));
        store = store;
        mixpanel.track('scope:item:remove');
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

        mixpanel.track('scope:item:indispensable:update');
        store = store;

    }

    function scopeAddItem(scope, name, indispensable, description) {
        update(scopes => get(store).map((s) => {
            if (scope.id === s.id) {
                s.items = [new ScopeItem(name, indispensable, description), ...s.items];
            }
            return s;
        }));
        mixpanel.track('scope:item:add');

        store = store;
    }

    function scopeDependsOn(scope, scopes) {
        let result;
        result = scopes.filter(
            // (s) => scope.dependsOn.includes(s.id) || scope.dependsOn.includes(s.forkedScopeId)
            (s) => scope.dependsOn.includes(s.id)
        );
        return result;
    }

    function scopeUnlocksDependenciesOf(scope, scopes = []) {
        let result;
        if (scopes.length) {
            let forkedScope = scopes.find((s2) => s2.forkedScopeId === scope.id);
            let forkedScopeId = forkedScope ? forkedScope.id : 0;
            // return scopes.filter((s) => (s.dependsOn.includes(scope.id) && !s.forkedScopeId) || s.dependsOn.includes(scope.forkedScopeId) || s.dependsOn.includes(forkedScopeId));
            result = scopes.filter((s) => (s.dependsOn.includes(scope.id) && !s.forkedScopeId) || s.dependsOn.includes(scope.forkedScopeId));

        } else {
            result = get(store).filter((s) => s.dependsOn.includes(scope.id) && !s.forkedScopeId);
        }

        return result.filter((item) => item != null)
    };

    function scopeFilterItems(scope, indispensable = true) {
        return scope.items.filter((item) => item.indispensable === indispensable)
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

    function filterIndispensable(indispensableScope, indispensableTask) {
        return (group) => {
            group.indispensable = indispensableScope;
            group.indispensableTasks = indispensableTask;

            group.items = group.items.filter((s) => s.indispensable === indispensableScope && s.items.length).map((s) => {
                s.items = s.items.filter((item) => item.indispensable === indispensableTask);
                return s;
            })
            return group;
        }
    };

    function filterGroupsScopes(groupsScopes, fnFilter = (g) => g) {
        return deepCopy(groupsScopes).map((g) => {
            g = fnFilter(g);
            g.items = g.items.filter((s) => s.items.length);

            g.dependencyPackage = (g.items?.length > 1);
            return g;
        }).filter((g) => g.items?.length);
    }

    function sortScopesinGroupForking(groupsScopes) {

        groupsScopes = deepCopy(groupsScopes);

        let indispensableScopesIndispensableTasks = regroupScopes(filterGroupsScopes(groupsScopes, filterIndispensable(true, true)));
        let indispensableScopesNiceToHaveTasks = regroupScopes(filterGroupsScopes(groupsScopes, filterIndispensable(true, false)));

        let indispensableGroup = [].concat(
            classifyScopes(indispensableScopesIndispensableTasks),
            classifyScopes(indispensableScopesNiceToHaveTasks)
        );

        let niceToHaveScopesIndispensableTasks = regroupScopes(filterGroupsScopes(groupsScopes, filterIndispensable(false, true)));
        let niceToHaveScopesNiceToHaveTasks = regroupScopes(filterGroupsScopes(groupsScopes, filterIndispensable(false, false)));

        let niceToHaveGroup = [].concat(
            classifyScopes(niceToHaveScopesIndispensableTasks),
            classifyScopes(niceToHaveScopesNiceToHaveTasks)
        );

        return {
            indispensable: indispensableGroup,
            niceToHave: niceToHaveGroup,
        }
    }

    function getFlatListScopesFromGroup(groups) {
        let arrGroup = deepCopy(groups);
        let flatList = [...arrGroup].reduce(
            (acc, group, idx, arr) => {
                group.items.map((s) => {
                    acc.push(s);
                })
                return acc.flat(2);
            },
            []
        );
        return flatList;
    }

    function classifyScopes(groups) {
        let forkedScopes = [];
        let groupsRisky = [];
        let scopesRisky = [];
        let itemsRemainingOfGroupsBasedOnRisky = [];

        groupsRisky = deepCopy(groups).map((group) => {
            let indexLastRisky = lastIndexOf(group.items, 'risky', true);
            let groupRiskyHasItems = group.items[indexLastRisky] && group.items[indexLastRisky].items.length > 0;
            scopesRisky = [];

            if (indexLastRisky > 0 && groupRiskyHasItems) {
                scopesRisky = group.items.slice(0, indexLastRisky + 1);
                itemsRemainingOfGroupsBasedOnRisky = itemsRemainingOfGroupsBasedOnRisky.concat(group.items.slice(indexLastRisky + 1, group.items.length));
            } else if (indexLastRisky > 0 && !groupRiskyHasItems) {
                scopesRisky = [];
                itemsRemainingOfGroupsBasedOnRisky = itemsRemainingOfGroupsBasedOnRisky.concat(group.items.slice(indexLastRisky + 1, group.items.length));
            } else if (indexLastRisky === 0 && group.items[0].risky) {
                scopesRisky = [group.items[0]];
                itemsRemainingOfGroupsBasedOnRisky = itemsRemainingOfGroupsBasedOnRisky.concat(group.items.slice(indexLastRisky + 1, group.items.length));
            } else if (indexLastRisky < 0) {
                scopesRisky = [];
                itemsRemainingOfGroupsBasedOnRisky = itemsRemainingOfGroupsBasedOnRisky.concat(group.items.slice(0, group.items.length));
            }

            group.items = updateDependenciesOfScopesGeneratedByFork(scopesRisky.reduce((acc, scope) => {
                let someScopeDependsOnThat = scopesRisky.some((s) => s.dependsOn.includes(scope.id));

                if (!scope.risky && !someScopeDependsOnThat) {
                    itemsRemainingOfGroupsBasedOnRisky.push(scope);
                }
                else {
                    if (!scope.risky) {
                        if (scope.items.length) {
                            forkedScopes = [...forkedScopes, generateForkingScope(scope)];
                            acc.push(scope);
                        }
                    } else {
                        acc.push(scope);
                    }
                }
                return acc;
            }, []));

            group.dependencyPackage = group.items.length > 1;

            return group;
        }, []);


        let groupForkedScopes = groupScopes(forkedScopes);
        let groupRemainingItems = groupScopes(itemsRemainingOfGroupsBasedOnRisky.filter((s) => s.items.length));

        return [...filterGroupsScopes(groupsRisky), ...regroupScopes(groupForkedScopes.concat(groupRemainingItems))];
    }

    function generateForkingScope(scope) {
        let previousId = scope.id;
        let forkedScope = deepCopy(scope);
        forkedScope.id = previousId;
        forkedScope.hasForks = true;
        scope.forkedScopeId = scope.id;

        let scopeRandomId = uuidv4();
        scope.id = scope.id + '-' + scopeRandomId;
        return forkedScope;
    }

    function sortScopesByPriority() {
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1
        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071

        let copyFilteredStore = deepCopy(get(store).filter((scope) => scope.id !== 'bucket' && scope.items.length > 0));
        let groupedScopes = groupScopes(copyFilteredStore);
        let groupedSortedScopes = mergeSort(mergeGroupScopes, groupedScopes);

        let sortedGroupedSequenceScopes = sortScopesinGroupForking(groupedSortedScopes);
        sortedGroupedSequenceScopes = generateSequence([...sortedGroupedSequenceScopes.indispensable, ...sortedGroupedSequenceScopes.niceToHave]);

        let sortedScopesDocumentation = mergeSort(mergeScopesForDocumentation, copyFilteredStore).map((s, idx) => { s.orderDocumentation = idx + 1; return s; });

        return {
            sortedGroupedSequenceScopes: sortedGroupedSequenceScopes,
            sortedScopesDocumentation: sortedScopesDocumentation
        }
    }

    function updateDependenciesOfScopesGeneratedByFork(scopes) {
        let arrScopes = deepCopy(scopes);
        return arrScopes.map((scope, index) => {
            if (arrScopes[index + 1]) {
                let indexDependsOn = scopes[index + 1]?.dependsOn?.indexOf(scope.forkedScopeId);
                if (indexDependsOn > -1) {
                    arrScopes[index + 1].dependsOn[indexDependsOn] = scope.id;
                }
            }
            return scope;
        });
    }

    const lastIndexOf = (array, key, value) => {
        for (let i = array?.length - 1; i >= 0; i--) {
            if (array[i][key] === value) return i;
        }
        return -1;
    };

    /**
     * 
     * @param {GroupScopes[]} groups 
     * @returns {GroupScopes[]}
     */
    function generateSequence(groups) {
        let newArrGroups = deepCopy(groups);
        let idxSequence = 0;
        newArrGroups.forEach((g, idx) => {
            g.id = convertToNumberingScheme(idx + 1);
            g.order = idx + 1;
            g.items.forEach((s) => {
                idxSequence++;
                s.order = idxSequence;
            });
        });
        return newArrGroups;

    }

    /**
     * 
     * @param {GroupScopes} group 
     * @returns {GroupScopes[]}
     */
    function regroupScopes(groups) {
        return groupScopes(getFlatListScopesFromGroup(filterGroupsScopes(groups)));
    }

    /**
     * 
     * @param {Scope[]} scopes 
     * @returns {GroupScopes[]}
     */
    function groupScopes(scopes) {
        // copied from: https://stackoverflow.com/questions/41669281/group-array-by-nested-dependent-array-element
        // make matrix graph
        scopes = deepCopy(scopes);
        var map = {};
        for (var i = 0; i < scopes.length; i++) {
            var scope = scopes[i];
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
                groupsScopes.push(group);
            }

            for (var dependKey in map[key]) {
                if (group.indexOf(dependKey) == -1) {
                    group.push(dependKey);
                }
            }
        }

        let scopesToUngroup = [];

        let idx = 0;
        let groupsOfGroup = groupsScopes.map(function (groupOfIds) {
            let dependencyPackage = false;
            let risky;
            let indispensable;
            let indispensableTasks;
            let hasForks;

            var scopesToGroup = [];
            groupOfIds.forEach(function (id) {
                var scope = scopes.filter(function (e) {
                    return e.id == id;
                })[0];

                if (scope) {
                    let foundInGroup = scopes.some((s) => scope.dependsOn.includes(s.id)) || scopes.some((s) => s.dependsOn.includes(scope.id));
                    if (!scope.dependsOn.length || foundInGroup) {
                        scopesToGroup.push(scope);
                    } else {
                        scopesToUngroup.push(scope);
                    }
                }
            });
            if (scopesToGroup.length > 1) {
                dependencyPackage = true;
            } else {
                dependencyPackage = false;
            }
            idx++;


            risky = scopesToGroup.every((s) => s.risky || s.forkedScopeId);
            indispensable = scopesToGroup.every((s) => s.indispensable);
            indispensableTasks = scopesToGroup.every((s) => s.items.every((item) => item.indispensable));
            hasForks = scopesToGroup.every((s) => s.hasForks);


            let newGroup = { id: -1, risky: risky, hasForks: hasForks, indispensable: indispensable, indispensableTasks: indispensableTasks, dependencyPackage: dependencyPackage, items: mergeSort(mergeScopes, scopesToGroup) };
            return newGroup;
        });

        scopesToUngroup = mergeSort(mergeScopes, scopesToUngroup);
        scopesToUngroup.forEach((s) => {
            groupsOfGroup.push({ id: -1, risky: s.risky, hasForks: s.hasForks, indispensable: s.indispensable, indispensableTasks: s.items.every((item) => item.indispensable), dependencyPackage: false, items: [s] });
        })

        return mergeSort(mergeGroupScopes, filterGroupsScopes(groupsOfGroup));
    }

    function mergeGroupScopes(left, right) {
        let sortedArr = []; // the sorted elements will go here

        while (left.length && right.length) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> mergeGroupScopes right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>> mergeGroupScopes left[0]:', left[0]);

            if (left[0].items.filter((scope) => scope.risky).length > right[0].items.filter((scope) => scope.risky).length) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (right[0].items.filter((scope) => scope.risky).length > left[0].items.filter((scope) => scope.risky).length) {
                sortedArr.push(right.shift());
                // console.log('} else if (!left[0].risky && right[0].risky) {');
            } else if (left[0].hasForks && !right[0].hasForks) {
                sortedArr.push(left.shift());
            } else if (right[0].hasForks && !left[0].hasForks) {
                sortedArr.push(right.shift());
            } else if (left[0].items.length > right[0].items.length) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (right[0].items.length > left[0].items.length) {
                sortedArr.push(right.shift());
                // console.log('} else if (!left[0].risky && right[0].risky) {');
            } else {
                sortedArr.push(left.shift());
            }
            // console.log('...:', deepCopy(sortedArr));

        }

        // console.log('sortedArr:', deepCopy(sortedArr));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }

    function mergeScopes(left, right, originalArr) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> mergeScopes right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> mergeScopes left[0]:', left[0]);

            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
            } else if (left[0].hasForks && !right[0].hasForks) {
                sortedArr.push(left.shift());
            } else if (right[0].hasForks && !left[0].hasForks) {
                sortedArr.push(right.shift());
            }
            // else if (left[0].indispensable && !right[0].indispensable) {
            //     sortedArr.push(left.shift());
            //     // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            // }
            // else if (right[0].indispensable && !left[0].indispensable) {
            //     sortedArr.push(right.shift());
            // }
            // else if (left[0].risky && !right[0].risky) {
            //     sortedArr.push(left.shift());
            //     // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            // } else if (right[0].risky && !left[0].risky) {
            //     sortedArr.push(right.shift());

            // }
            // else if ((left[0].indispensable && left[0].risky) && (!right[0].indispensable && !right[0].risky)) {
            //         sortedArr.push(left.shift());
            //         // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            //     }
            //     else if ((right[0].indispensable && right[0].risky) && (!left[0].indispensable && !left[0].risky)) {
            //         sortedArr.push(right.shift());
            //         // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            //     }
            //     else if ((left[0].indispensable && !left[0].risky) && (!right[0].indispensable && !right[0].risky)) {
            //         sortedArr.push(left.shift());
            //         // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            //     }
            //     else if ((right[0].indispensable && right[0].risky) && (!left[0].indispensable && !left[0].risky)) {
            //         sortedArr.push(right.shift());
            //         // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            //     }


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
            else {
                sortedArr.push(left.shift());
            }
            // console.log('...:', deepCopy(sortedArr));

        }

        // console.log('sortedArr:', deepCopy(sortedArr));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }


    function mergeScopesForDocumentation(left, right, originalArr) {
        let sortedArr = []; // the sorted elements will go here
        while (left.length && right.length) {


            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
                // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
            } else if (left[0].indispensable && !right[0].indispensable) {
                sortedArr.push(left.shift());
                // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            }
            else if (right[0].indispensable && !left[0].indispensable) {
                sortedArr.push(right.shift());
            }
            else if (left[0].risky && !right[0].risky) {
                sortedArr.push(left.shift());
                // console.log('(left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id))');
            } else if (right[0].risky && !left[0].risky) {
                sortedArr.push(right.shift());


                // } else if (left[0].risky && !right[0].risky) {
                //     sortedArr.push(left.shift());
                //     // console.log('} else if (left[0].risky && !right[0].risky) {');
                // } else if (!left[0].risky && right[0].risky) {
                //     sortedArr.push(right.shift());




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
                sortedArr.push(left.shift());
            }
            // console.log('...:', deepCopy(sortedArr));

        }

        // console.log('sortedArr:', deepCopy(sortedArr));
        // use spread operator and create a new array, combining the three arrays
        return [...sortedArr, ...left, ...right];
    }

    function mergeSort(merger, arr, originalArr = []) {
        if (originalArr.length === 0) {
            arr = deepCopy(arr);
            originalArr = deepCopy(arr);
        }

        // the base case is array length <=1
        if (arr.length <= 1) {
            return arr;
        }

        const half = arr.length / 2;
        const left = arr.splice(0, half); // the first half of the array
        const right = arr;
        return merger(mergeSort(merger, left, originalArr), mergeSort(merger, right, originalArr), originalArr);
    }


    function sequenceToText(groups, toggleAddInfo, toggleAutoTodo) {
        let text = '';
        let idxGlobal = 0;

        let priorities = ['#A', '#B', '#C'];
        let idxPriority = 0;

        groups.forEach((group, idxGroup) => {
            group.items.forEach((scope, idxScope) => {
                idxGlobal++;

                if (idxGlobal > 1) {
                    text = text.concat('\n');
                }
                text = text.concat(
                    '- ### ' +
                    'Step ' +
                    idxGlobal +
                    ': **' +
                    (scope.name || scope.placeholder) +
                    '** - ' +
                    (scope.indispensable ? 'Indispensable' : 'Nice-to-have')
                );

                let unlockDependencies = projectStore
                    .scopeUnlocksDependenciesOf(scope, scopes);

                let dependsOn = projectStore.dependsOn(scope, scopes);

                if (toggleAddInfo) {
                    if (
                        scope.forkedScopeId ||
                        scope.risky ||
                        dependsOn?.length ||
                        unlockDependencies.length
                    ) {
                        text = text.concat('\n\t- Info:');

                        if (scope.forkedScopeId) {
                            text = text.concat(
                                '\n\t\t- WARNING: The sole intention at this step is allowing the execution of the tasks of the next step.' +
                                '\n\t\t- Think about affordances or simulated ways to mimic the real behavior of the tasks here.' +
                                '\n\t\t- In the world of software development you can think about dummy objects, fake objects, stubs and mocks.'
                            );
                        }
                        if (scope.risky) {
                            text = text.concat(
                                scope.risky ? '\n\t- WARNING: This scope is RISKY because it has UNKNOWNS' : ''
                            );
                        }

                        if (dependsOn?.length > 0) {
                            text = text.concat('\n\t- This scope depends on the following scopes:');
                            dependsOn.forEach((s) => {
                                text = text.concat('\n\t\t- ' + s.name);
                            });
                        }
                        // let unlocksScopes = group.items.filter((s) => s.dependsOn?.includes(scope.id));
                        if (unlockDependencies.length > 0) {
                            text = text.concat('\n\t- This scope unlocks the following scopes:');
                            unlockDependencies.forEach((s) => {
                                text = text.concat('\n\t\t- ' + s.name);
                            });
                        }
                    }
                }

                if (!scope.forkedScopeId) {
                    if (group.indispensableTasks) {
                        text = text.concat('\n\t- Indispensable tasks:');
                    } else {
                        text = text.concat('\n\t- Nice-to-have tasks:');
                    }
                    if (scope.items.length) {
                        scope.items.forEach((item) => {
                            text = text.concat(
                                '\n\t\t- ' +
                                (toggleAutoTodo
                                    ? group.indispensableTasks
                                        ? 'LATER' + (idxPriority <= 3 ? ' [' + priorities[idxPriority] + '] ' : '')
                                        : 'LATER'
                                    : '') +
                                ' ' +
                                item.name
                            );
                        });
                    } else {
                        text = text.concat('\n\t\t- No item added');
                    }
                } else {
                    text = text.concat(
                        '\n\t\t- ' +
                        (toggleAutoTodo
                            ? group.indispensableTasks
                                ? 'LATER' + (idxPriority <= 3 ? ' [' + priorities[idxPriority] + '] ' : '')
                                : 'LATER'
                            : '') +
                        'At this step, do as little as possible, only what is needed, to enable doing the tasks of the next step.'
                    );
                }
            });
        });

        return text;
    }

    function documentationToText(scopes, autoNumber) {
        let text = '';
        let textNumberTitle = 1;
        scopes.forEach((scope, idx) => {
            if ((scope.title || scope.name) && scope.id !== 'bucket') {
                text = text.concat(
                    '- ### ' +
                    (autoNumber ? textNumberTitle + '. ' : '') +
                    (scope.title ? scope.title.trim() : scope.name ? 'Scope ' + scope.name : '') +
                    '\n'
                );

                if (scope.description) {
                    let textNumberDescription = 1;
                    scope.description.split('\n').map((line) => {
                        text = text.concat(
                            '\t- ' +
                            (autoNumber ? textNumberTitle + '.' + textNumberDescription + '. ' : '') +
                            line +
                            '\n'
                        );
                        textNumberDescription++;
                    });
                }
                textNumberTitle++;
            }
        });

        return text;
    }

    return {
        set,
        update,
        subscribe,
        length: get(store).length,
        reset: reset,
        createInitialData: createInitialData,
        addScope,
        addBucketScope,
        addScopeAutoId,
        scopeDependsOn: scopeDependsOn,
        scopeUnlocksDependenciesOf: scopeUnlocksDependenciesOf,
        scopeRemoveItem,
        scopeUpdateRisky,
        scopeUpdateIndispensable,
        scopeFilterItems,
        itemUpdateIndispensable,
        sortItemsByIndispensable,
        updateDependencies,
        scopeAddItem,
        sortScopesByPriority,
        generateSequence,
        filterScopes,
        filterScopesButBucket,
        filterScopesWithItemsExcludingBucket,
        filterScopesWithItemsExcludingThisAndBucket,
        sequenceToText,
        documentationToText
    }
};

