import ScopeItem from "$lib/classes/ScopeItem"

// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1


export default class Scope {
    constructor(id, name, order = 0, items = [], dependencies = [], dependents = [], risky = false) {
        this.id = id
        this.name = name
        this.order = order
        this.items = items
        this.dependencies = [...new Set(dependencies)]
        this.dependents = [...new Set(dependents)]
        this.risky = risky
    }

    addItem(name, description = "") {
        console.log('add item:', name);
        this.items.push(new ScopeItem(name, description))
    }

    filterItemsIndispensable() {
        return this.items.filter((item) => !item.niceToHave)
    }
    filterItemsNiceToHave() {
        return this.items.filter((item) => item.niceToHave)
    }

}    