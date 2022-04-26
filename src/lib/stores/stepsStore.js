import { writable } from "svelte/store";


export const stepsStore = writable([
    {
        linkText: 'Dump & Cluster',
        h1: 'Dump & Cluster',
        link: '/scopes/dump',
        active: true,
        completed: true
    },
    {
        linkText: 'Set Dependencies',
        h1: 'Set Dependencies',
        link: '/scopes/dependencies',
        active: false,
        completed: true
    },
    {
        linkText: 'Set Risky Unknowns',
        h1: 'Set Risky Unknowns',
        link: '/scopes/unknowns',
        active: false,
        completed: true
    },
    {
        linkText: 'Generate Sequence',
        h1: 'Automatic sequence to execute the scopes',
        link: '/scopes/sequence',
        active: false,
        completed: true
    },
    {
        linkText: 'Create Documentation',
        h1: 'Documentation',
        h2: 'Create documentation to other people that will execute it',
        link: '/scopes/patternLanguage',
        active: false,
        completed: true
    }
])

