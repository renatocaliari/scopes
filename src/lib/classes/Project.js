import { writable, derived, get } from "svelte/store"
import Scope from "$lib/classes/Scope";
import { localStorageStore } from 'fractils'

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

export default class Project {
    #idxScope = 0;
    constructor(scopes = []) {
        this.scopes = localStorageStore('projectStore', scopes);
        // this.scopes = writable(scopes);
        // scopes.forEach(scope => {
        //     this.addScope(scope.id, scope.name, scope.order, scope.items, scope.dependencies, scope.dependents, scope.risky)
        // });
        for (let i = 0; i < this.$scopes.filter(); i++) {
            this.$scopes[i].value++
        }
        this.#idxScope = this.$scopes.length + 1;
    }

    addBucketScope(name, order = 0, items = [], dependencies = [], dependents = [], risky = false) {
        this.$scopes = [...this.$scopes, new Scope('bucket', name, order, items, dependencies, dependents, risky)]
    }

    addScope(id, name, order = 0, items = [], dependencies = [], dependents = [], risky = false) {
        this.$scopes = [...this.$scopes, new Scope(id, name, order, items, dependencies, dependents, risky)]
    }

    addScopeAutoId(name, order = 0, items = [], dependencies = [], dependents = [], risky = false) {
        this.#idxScope += 1;
        this.$scopes = [...this.$scopes, new Scope('scope-' + this.#idxScope, name, order, items, dependencies, dependents, risky)]
    }

    filterScopesWithItemsExcludingBucket() {
        return this.$scopes.filter((scope) => scope.id !== 'bucket' && scope.items.length > 0)
    }

    getScopesExcludingThis(currentScope) {
        return this.$scopes.filter((scope) => scope.id != currentScope.id && scope.id !== "bucket");
    }

    filterScopes(fn) {
        return this.$scopes.filter(fn);
    }
    sortScopes() {
        return this.$scopes.sort((a, b) => {
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
        });
    }

    sortScopesByPriority() {
        return this.$scopes.sort(compare);
    }

    static fromObject(obj) {
        return new Project(obj);
    }
    // get totalMetaStore() {
    //     return this.items.reduce((sum, item) => sum + item.subTotal, 0);
    // }
}


function compare(first, second) {
    let ret = 0;
    if (first.risky && !second.risky && first.dependencies.includes(second.id)) {
        ret = 1;
    } else if (first.risky && !second.risky && !first.dependencies.includes(second.id)) {
        ret = -1;
    } else if (first.risky && second.risky && first.dependents.length > second.dependents.length) {
        ret = -1;
    } else if (
        first.risky &&
        second.risky &&
        first.dependents.length === second.dependents.length &&
        first.items.length > second.items.length
    ) {
        ret = -1;
    } else if (
        !first.risky &&
        !second.risky &&
        first.dependents.length > second.dependents.length
    ) {
        ret = -1;
    } else if (!first.risky && !second.risky && first.dependencies.includes(second.id)) {
        ret = 1;
    } else if (
        !first.risky &&
        !second.risky &&
        first.dependencies.length < second.dependencies.length
    ) {
        ret = -1;
    } else if (
        !first.risky &&
        !second.risky &&
        first.dependencies.length > second.dependencies.length
    ) {
        ret = 1;
    }
    return ret;
}
