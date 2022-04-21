import ScopeItem from "$lib/classes/ScopeItem"

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1


export default class Scope {
    constructor(id, name, order = 0, items = [], dependendsOn = [], risky = false) {
        this.id = id
        this.name = name
        this.order = order
        this.items = items
        this.dependsOn = [...new Set(dependendsOn)]
        this.risky = risky
    }

    unlocksDependencies = ((project) => {
        let result = project.getScopes().filter((scope) => scope.dependsOn.includes(this.id)).map((s) => s.id);
        return result;
    });


    addItem(name, description = "") {
        console.log('add item:', name);
        this.items = [...this.items, new ScopeItem(name, description)];
    }

    filterItemsIndispensable() {
        console.log('this.items:', this.items);
        return this.items.filter((item) => !item.niceToHave)
    }
    filterItemsNiceToHave() {
        return this.items.filter((item) => item.niceToHave)
    }

}    