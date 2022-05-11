
import { get } from "svelte/store"
import ScopeItem from "$lib/classes/ScopeItem";
import { dev } from '$app/env';
import { writable } from 'svelte-local-storage-store'
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
// console.log('store:', JSON.stringify(get(store)));
export let storeSortedGroupedScopes = writable('scopesSorted', []);
export let storeSortedGroupedAndForkedScopes = writable('sortedGroupedAndForkedScopes', []);
export let storeSortedGroupedSequenceScopes = writable('sortedGroupedSequenceScopes', []);
export let storeSortedScopesDocumentation = writable('sortedScopesDocumentation', []);
// export let sortedGroupedScopes = writable([]);
// export let sortedGroupedAndForkedScopes = writable([]);
// export let sortedScopesDocumentation = writable([]);

export function ProjectStore() {
    // let store = persistentWritable("scopes", []);
    // let store = localStorageStore("scopes", []);
    // console.log('store:', JSON.stringify(get(store)));

    const { set, subscribe, update } = store;

    function reset(sampleData = false, idxSample) {
        // console.log('reseting...');
        set([]);
        createInitialData(true, 9, sampleData, idxSample = 2);
    }

    if (get(store).length === 0) {
        // console.log('creating initial data')
        createInitialData(true, 9, true);
    }

    function createInitialData(hasBucket, totalScopes, sampleData, idxSample = 2) {
        // console.log('store empty')
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

    function scopeUnlocksDependencies(scope, scopes = []) {
        // console.log('### scope:', scope);
        // console.log('### scope.id:', scope.id);
        // console.log('### scope.forkedScopeId:', scope.forkedScopeId);
        // console.log('### scopes:', scopes);
        if (scopes.length) {
            let forkedScope = scopes.find((s2) => s2.forkedScopeId === scope.id);
            let forkedScopeId = forkedScope ? forkedScope.id : 0;
            // console.log('### forkedScope:', forkedScope);
            // console.log('### forkedScopeId:', forkedScopeId);
            // console.log('### scopes.filter((s) => s.dependsOn.includes(scope.id) || s.dependsOn.includes(scope.forkedScopeId) || s.dependsOn.includes(forkedScopeId)):', scopes.filter((s) => s.dependsOn.includes(scope.id) || s.dependsOn.includes(scope.forkedScopeId) || s.dependsOn.includes(forkedScopeId)));
            return scopes.filter((s) => s.dependsOn.includes(scope.id) && !s.forkedScopeId); //|| s.dependsOn.includes(scope.forkedScopeId) || s.dependsOn.includes(forkedScopeId));
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


    // indispensaveis arriscados que dependem de indispensaveis
    //     agrupados no primeiro grupo de arriscados
    // indispensaveis arriscados que dependem de nice-to-have
    //     não pode acontecer
    // indispensaveis que dependem de indispensaveis arriscados
    //     dividido, o indispensavel aparece no segundo grupo e o arriscado no primeiro
    // indispensaveis que dependem de indispensaveis
    //     agrupados no segundo grupo
    // indispensaveis que dependem de nice - to - have
    //     não pode acontecer
    // nice - to - have que dependem de indispensaveis
    //     dividido, o nice-to-have aparece no terceiro grupo de nice-to-have
    // nice - to - have que dependem de nice - to - have
    //     agrupado no terceiro grupo de nice-to-have


    // ordenacao dos nicetohave
    // primeiros os scopes indispensable com as tarefas nice to have
    // depois os scopes nicetohave arriscados
    // depois os scopes nicetohave


    function sortScopesinGroupForking(groupsScopes) {
        // indispensaveis arriscados que dependem de indispensaveis
        //     agrupados no primeiro grupo de arriscados

        let groupForkedScopes = [];
        let groupRemainingItems = [];

        let groupsRisky = [];

        let groupsRiskyIndispensableScopesIndispensableTasks = [];
        let groupForkedIndispensableScopesIndispensableTasks = [];
        let groupRemainingIndispensableScopesIndispensableTasks = [];

        let groupsRiskyIndispensableScopesNiceToHaveTasks = [];
        let groupForkedIndispensableScopesNiceToHaveTasks = [];
        let groupRemainingIndispensableScopesNiceToHaveTasks = [];

        let groupsRiskyNiceToHaveScopesIndispensableTasks = [];
        let groupForkedNiceToHaveScopesIndispensableTasks = [];
        let groupRemainingNiceToHaveScopesIndispensableTasks = [];

        let groupsRiskyNiceToHaveScopesNiceToHaveTasks = [];
        let groupForkedNiceToHaveScopesNiceToHaveTasks = [];
        let groupRemainingNiceToHaveScopesNiceToHaveTasks = [];

        // console.log('groupScopes:', JSON.parse(JSON.stringify(groupsScopes)));

        let indispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.indispensable = true;
            g.items = g.items.filter((s) => s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => item.indispensable);
                return s;
            });
            g.indispensableTasks = true;
            return g;
        }).filter((g) => g.items.length);
        indispensableScopesIndispensableTasks = groupScopes(getFlatListScopesFromGroup(indispensableScopesIndispensableTasks));


        let indispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => !item.indispensable);
                return s;
            });
            g.indispensableTasks = false;
            return g;
        }
        ).filter((g) => g.items.length);
        indispensableScopesNiceToHaveTasks = groupScopes(getFlatListScopesFromGroup(indispensableScopesNiceToHaveTasks));


        // console.log('indispensableScopesIndispensableTasks:', indispensableScopesIndispensableTasks);
        // console.log('indispensableScopesNiceToHaveTasks:', indispensableScopesNiceToHaveTasks);

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(indispensableScopesIndispensableTasks));
        groupsRiskyIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupForkedIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupRemainingIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);


        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(indispensableScopesNiceToHaveTasks));
        groupsRiskyIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupForkedIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupRemainingIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);

        let indispensableGroup = [].concat(groupsRiskyIndispensableScopesIndispensableTasks, groupForkedIndispensableScopesIndispensableTasks, groupRemainingIndispensableScopesIndispensableTasks, groupsRiskyIndispensableScopesNiceToHaveTasks, groupForkedIndispensableScopesNiceToHaveTasks, groupRemainingIndispensableScopesNiceToHaveTasks);


        let niceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => !s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => item.indispensable);
                return s;
            });
            // g.dependencyPackage = (g.items.length > 1);
            g.indispensableTasks = true;
            return g;
        }
        ).filter((g) => g.items.length);
        niceToHaveScopesIndispensableTasks = groupScopes(getFlatListScopesFromGroup(niceToHaveScopesIndispensableTasks));


        let niceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => !s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => !item.indispensable);
                return s;
            });
            // g.dependencyPackage = (g.items.length > 1);
            g.indispensableTasks = false;
            return g;
        }
        ).filter((g) => g.items.length);

        niceToHaveScopesNiceToHaveTasks = groupScopes(getFlatListScopesFromGroup(niceToHaveScopesNiceToHaveTasks), true);

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(niceToHaveScopesIndispensableTasks));
        groupsRiskyNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupForkedNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupRemainingNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(niceToHaveScopesNiceToHaveTasks));
        groupsRiskyNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupForkedNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupRemainingNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);


        // console.log('>>> niceToHaveScopesNiceToHaveTasks:', niceToHaveScopesNiceToHaveTasks);
        // console.log('>>> groupsRiskyNiceToHaveScopesNiceToHaveTasks:', groupsRiskyNiceToHaveScopesNiceToHaveTasks);
        // console.log('>>> groupForkedNiceToHaveScopesNiceToHaveTasks:', groupForkedNiceToHaveScopesNiceToHaveTasks);
        // console.log('>>> groupRemainingNiceToHaveScopesNiceToHaveTasks:', groupRemainingNiceToHaveScopesNiceToHaveTasks);

        let niceToHaveGroup = [].concat(groupsRiskyNiceToHaveScopesIndispensableTasks, groupForkedNiceToHaveScopesIndispensableTasks, groupRemainingNiceToHaveScopesIndispensableTasks, groupsRiskyNiceToHaveScopesNiceToHaveTasks, groupForkedNiceToHaveScopesNiceToHaveTasks, groupRemainingNiceToHaveScopesNiceToHaveTasks).filter((g) => g.items.length);

        return {
            indispensable: indispensableGroup,
            niceToHave: niceToHaveGroup,
        }
    }

    function sortScopesinGroupForkingBkp(groupsScopes) {
        // indispensaveis arriscados que dependem de indispensaveis
        //     agrupados no primeiro grupo de arriscados

        let groupForkedScopes = [];
        let groupRemainingItems = [];

        let groupsRisky = [];

        let groupsRiskyIndispensableScopesIndispensableTasks = [];
        let groupForkedIndispensableScopesIndispensableTasks = [];
        let groupRemainingIndispensableScopesIndispensableTasks = [];

        let groupsRiskyIndispensableScopesNiceToHaveTasks = [];
        let groupForkedIndispensableScopesNiceToHaveTasks = [];
        let groupRemainingIndispensableScopesNiceToHaveTasks = [];

        let groupsRiskyNiceToHaveScopesIndispensableTasks = [];
        let groupForkedNiceToHaveScopesIndispensableTasks = [];
        let groupRemainingNiceToHaveScopesIndispensableTasks = [];

        let groupsRiskyNiceToHaveScopesNiceToHaveTasks = [];
        let groupForkedNiceToHaveScopesNiceToHaveTasks = [];
        let groupRemainingNiceToHaveScopesNiceToHaveTasks = [];

        // console.log('groupScopes:', JSON.parse(JSON.stringify(groupsScopes)));

        let indispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.indispensable = true;
            g.items = g.items.filter((s) => s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => item.indispensable);
                return s;
            });
            g.indispensableTasks = true;
            return g;
        }).filter((g) => g.items.length);
        indispensableScopesIndispensableTasks = groupScopes(getFlatListScopesFromGroup(indispensableScopesIndispensableTasks));


        let indispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => !item.indispensable);
                return s;
            });
            g.indispensableTasks = false;
            return g;
        }
        ).filter((g) => g.items.length);
        indispensableScopesNiceToHaveTasks = groupScopes(getFlatListScopesFromGroup(indispensableScopesNiceToHaveTasks));


        // console.log('indispensableScopesIndispensableTasks:', indispensableScopesIndispensableTasks);
        // console.log('indispensableScopesNiceToHaveTasks:', indispensableScopesNiceToHaveTasks);

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(indispensableScopesIndispensableTasks));
        groupsRiskyIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupForkedIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupRemainingIndispensableScopesIndispensableTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);


        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(indispensableScopesNiceToHaveTasks));
        groupsRiskyIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupForkedIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupRemainingIndispensableScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);

        let indispensableGroup = [].concat(groupsRiskyIndispensableScopesIndispensableTasks, groupForkedIndispensableScopesIndispensableTasks, groupRemainingIndispensableScopesIndispensableTasks, groupsRiskyIndispensableScopesNiceToHaveTasks, groupForkedIndispensableScopesNiceToHaveTasks, groupRemainingIndispensableScopesNiceToHaveTasks);


        let niceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => !s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => item.indispensable);
                return s;
            });
            // g.dependencyPackage = (g.items.length > 1);
            g.indispensableTasks = true;
            return g;
        }
        ).filter((g) => g.items.length);
        niceToHaveScopesIndispensableTasks = groupScopes(getFlatListScopesFromGroup(niceToHaveScopesIndispensableTasks));


        let niceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsScopes)).map((g) => {
            g.items = g.items.filter((s) => !s.indispensable && s.items.length).map((s) => {
                s.items = s.items.filter((item) => !item.indispensable);
                return s;
            });
            // g.dependencyPackage = (g.items.length > 1);
            g.indispensableTasks = false;
            return g;
        }
        ).filter((g) => g.items.length);
        niceToHaveScopesNiceToHaveTasks = groupScopes(getFlatListScopesFromGroup(niceToHaveScopesNiceToHaveTasks));

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(niceToHaveScopesIndispensableTasks));
        groupsRiskyNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupForkedNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);
        groupRemainingNiceToHaveScopesIndispensableTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = true; return g; }).filter((g) => g.items.length > 0);

        ({ groupsRisky, groupForkedScopes, groupRemainingItems } = generateForkingScopesBasedOnRisky(niceToHaveScopesNiceToHaveTasks));
        groupsRiskyNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupsRisky)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupForkedNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupForkedScopes)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);
        groupRemainingNiceToHaveScopesNiceToHaveTasks = JSON.parse(JSON.stringify(groupRemainingItems)).map((g) => { g.indispensableTasks = false; return g; }).filter((g) => g.items.length > 0);

        let niceToHaveGroup = [].concat(groupsRiskyNiceToHaveScopesIndispensableTasks, groupForkedNiceToHaveScopesIndispensableTasks, groupRemainingNiceToHaveScopesIndispensableTasks, groupsRiskyNiceToHaveScopesNiceToHaveTasks, groupForkedNiceToHaveScopesNiceToHaveTasks, groupRemainingNiceToHaveScopesNiceToHaveTasks).filter((g) => g.items.length);

        return {
            indispensable: indispensableGroup,
            niceToHave: niceToHaveGroup,
        }
    }

    function getFlatListScopesFromGroup(group) {
        let arrGroup = JSON.parse(JSON.stringify(group));
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

    function generateForkingScopesBasedOnRisky(groups) {
        let forkedScopes = [];
        let itemsRemainingOfGroupsBasedOnRisky = [];

        let groupsRisky = JSON.parse(JSON.stringify(groups)).map((group, index) => {
            let indexLastRisky = lastIndexOf(group.items, 'risky', true);
            let groupRiskyHasItems = group.items[indexLastRisky] && group.items[indexLastRisky].items.length > 0;

            group.items = group.items.map((scope, index) => {
                scope.remove = true;
                scope.freezeOrder = false;
                let hasMoreItemsAfterFirstScope = index > 0;


                if ((index <= indexLastRisky) || (indexLastRisky === -1)) {
                    if (groupRiskyHasItems) {
                        let previousId = scope.id;

                        if (!scope.risky && groupRiskyHasItems && scope.items.length) {
                            let forkedScope = JSON.parse(JSON.stringify(scope));
                            forkedScope.id = previousId;
                            forkedScope.freezeOrder = false;
                            forkedScopes = [...forkedScopes, forkedScope];
                            scope.forkedScopeId = scope.id;

                            let scopeRandomId = uuidv4();
                            scope.id = scope.id + '-' + scopeRandomId;
                        }
                        // if (groupRiskyHasItems) {
                        scope.remove = false;
                        scope.freezeOrder = true;
                        // }
                    } else if (index !== indexLastRisky && scope.items.length) {
                        itemsRemainingOfGroupsBasedOnRisky.push(scope);
                    }
                } else if (hasMoreItemsAfterFirstScope && scope.items.length) {
                    itemsRemainingOfGroupsBasedOnRisky.push(scope);

                }
                return scope;
            }).filter((scope) => !scope.remove && scope.items.length);

            group.dependencyPackage = group.items.length > 1;
            group.items = updateDependenciesOfScopesGeneratedByFork(group.items);
            return group;
        });


        let groupForkedScopes = groupScopes(forkedScopes);
        let groupRemainingItems = groupScopes(itemsRemainingOfGroupsBasedOnRisky);

        return {
            groupsRisky: groupsRisky,
            groupForkedScopes: groupForkedScopes,
            groupRemainingItems: groupRemainingItems
        };
    }



    function sortScopesByPriority() {
        // it needed to copy elements from store instead of assign directly
        // based on this idea: https://svelte.dev/repl/44f170d0cd43440ca8dd8e2bff341bda?version=3.17.1
        // another idea with slice: https://github.com/sveltejs/svelte/issues/6071

        let copyFilteredStore = JSON.parse(JSON.stringify(get(store).filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)));
        let groupedScopes = groupScopes(copyFilteredStore);
        let groupedSortedScopes = mergeSort(mergeGroupScopes, groupedScopes);

        let sortedGroupedSequenceScopes = sortScopesinGroupForking(groupedSortedScopes);
        sortedGroupedSequenceScopes.sequence = generateSequence([...sortedGroupedSequenceScopes.indispensable, ...sortedGroupedSequenceScopes.niceToHave]);

        storeSortedGroupedScopes.set(groupedSortedScopes);
        storeSortedGroupedSequenceScopes.set(sortedGroupedSequenceScopes);
        storeSortedScopesDocumentation.set(mergeSort(mergeScopesForDocumentation, copyFilteredStore).map((s, idx) => { s.orderDocumentation = idx + 1; return s; }));

        return {
            storeSortedGroupedScopes: get(storeSortedGroupedScopes),
            storeSortedGroupedAndForkedScopes: get(storeSortedGroupedAndForkedScopes),
            storeSortedGroupedSequenceScopes: get(storeSortedGroupedSequenceScopes),
            storeSortedScopesDocumentation: get(storeSortedScopesDocumentation)
        }
    }

    function updateDependenciesOfScopesGeneratedByFork(scopes) {
        let arrScopes = JSON.parse(JSON.stringify(scopes));
        return arrScopes.filter((scope) => scope.freezeOrder).map((scope, index) => {
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

    function generateSequence(groups) {
        let newArrGroups = JSON.parse(JSON.stringify(groups));
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



    function groupScopes(scopes, showMsg = false) {
        // copied from: https://stackoverflow.com/questions/41669281/group-array-by-nested-dependent-array-element
        // make matrix graph
        scopes = JSON.parse(JSON.stringify(scopes));
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

        var idx = 0;
        var result = groupsScopes.map(function (groupOfIds) {
            let dependencyPackage = false;
            let risky;
            let indispensable;

            var scopesToGroup = [];
            groupOfIds.forEach(function (id) {
                var scope = scopes.filter(function (e) {
                    return e.id == id;
                })[0];

                if (scope) {
                    let encontrouNoGrupo = scopes.some((s) => scope.dependsOn.includes(s.id)) || scopes.some((s) => s.dependsOn.includes(scope.id));
                    if (!scope.dependsOn.length || encontrouNoGrupo) {
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

            // console.log('>>> scopesToGroup:', scopesToGroup);

            risky = scopesToGroup.every((s) => s.risky || s.forkedScopeId);
            indispensable = scopesToGroup.every((s) => s.indispensable);
            let newGroup = { id: -1, risky: risky, indispensable: indispensable, dependencyPackage: dependencyPackage, items: mergeSort(mergeScopes, scopesToGroup) };

            return newGroup;
        });

        // console.log('>>> scopes:', JSON.parse(JSON.stringify(scopes)));
        // console.log('>>> scopesToUngroup:', scopesToUngroup);
        scopesToUngroup = mergeSort(mergeScopes, scopesToUngroup);
        scopesToUngroup.forEach((s) => {
            result.push({ id: -1, risky: scope.risky, indispensable: scope.indispensable, dependencyPackage: false, items: [s] });
        })

        // console.log('#### result:', result);

        return result;
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
            } else if (left[0].items.length > right[0].items.length) {
                sortedArr.push(left.shift());
                // console.log('} else if (left[0].risky && !right[0].risky) {');
            } else if (right[0].items.length > left[0].items.length) {
                sortedArr.push(right.shift());
                // console.log('} else if (!left[0].risky && right[0].risky) {');
            } else {
                sortedArr.push(left.shift());
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

            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> mergeScopes right[0]:', right[0]);
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> mergeScopes left[0]:', left[0]);

            if (left[0].dependsOn?.includes(right[0].id) && !right[0].dependsOn?.includes(left[0].id)) {
                sortedArr.push(right.shift());
            } else if (right[0].dependsOn?.includes(left[0].id) && !left[0].dependsOn?.includes(right[0].id)) {
                sortedArr.push(left.shift());
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
            // console.log('...:', JSON.parse(JSON.stringify(sortedArr)));

        }

        // console.log('sortedArr:', JSON.parse(JSON.stringify(sortedArr)));
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
        generateSequence,
        filterScopes,
        filterScopesButBucket,
        filterScopesWithItemsExcludingBucket,
        filterScopesWithItemsExcludingThisAndBucket,
    }
};

