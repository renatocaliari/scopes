import { v4 as uuidv4 } from 'uuid';


// based on:
// a. without store: https://svelte.dev/repl/243498124f354af59070ae52da38d82f?version=3.44.2
// b. with store: https://svelte.dev/repl/164f13f5d99b46e7a8f4cb9627db2aee?version=3.44.1

export default class ScopeItem {
    constructor(name, indispensable = false) {
        this.id = uuidv4();
        this.name = name
        this.indispensable = indispensable
        this.description = ""
    }

    static createItem(name, indispensable = false) {
        return new ScopeItem(name, indispensable);
    }
}
