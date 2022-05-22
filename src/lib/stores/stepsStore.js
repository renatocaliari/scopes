import { writable } from "svelte/store";


export const stepsStore = writable([
    {
        linkText: '1. Dump & Cluster',
        h1: 'Dump & Cluster',
        link: '/scopes/dump',
        active: true,
        completed: false
    },
    {
        linkText: '2. Indispensable',
        h1: 'Indispensable',
        link: '/scopes/indispensable',
        active: false,
        completed: false
    },
    {
        linkText: '3. Risky Unknowns',
        h1: 'Risky Unknowns',
        h2: 'Set scopes with risky unknowns',
        link: '/scopes/unknowns',
        active: false,
        completed: false
    },
    {
        linkText: '4. Dependencies',
        h1: 'Set Dependencies',
        link: '/scopes/dependencies',
        active: false,
        completed: false
    },
    {
        linkText: '5. Sequence',
        h1: 'Sequence',
        link: '/scopes/sequence',
        active: false,
        completed: false
    },
    {
        linkText: '6. Create Documentation',
        h1: 'Documentation',
        h2: 'Create documentation to other people that will execute it',
        link: '/scopes/documentation',
        active: false,
        completed: false
    },
    // {
    //     linkText: '7. Workspace',
    //     h1: 'Documentation & Sketches',
    //     h2: 'See it in a workspace on TryEraser and create sketches',
    //     link: '/scopes/documentation',
    //     active: false,
    //     completed: false
    // }
])

