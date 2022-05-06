import { writable } from "svelte/store";


export const stepsStore = writable([
    {
        linkText: 'Dump & Cluster',
        h1: 'Dump & Cluster',
        link: '/scopes/dump',
        active: true,
        completed: false
    },
    {
        linkText: 'Indispensable',
        h1: 'Set which scopes and items are indispensable',
        link: '/scopes/indispensable',
        active: false,
        completed: false
    },
    {
        linkText: 'Risky Unknowns',
        h1: 'Set scopes with risky unknowns',
        link: '/scopes/unknowns',
        active: false,
        completed: false
    },
    {
        linkText: 'Dependencies',
        h1: 'Set Dependencies',
        link: '/scopes/dependencies',
        active: false,
        completed: false
    },
    {
        linkText: 'Sequence',
        h1: 'Generate Sequence',
        h2: 'Sequence for execution',
        link: '/scopes/sequence',
        active: false,
        completed: false
    },
    {
        linkText: 'Create Documentation',
        h1: 'Documentation',
        h2: 'Create documentation to other people that will execute it',
        link: '/scopes/documentation',
        active: false,
        completed: false
    }
])

