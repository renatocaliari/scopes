import { writable as writableLocal } from 'svelte-local-storage-store'
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const stepsCompleted = writableLocal('steps',
    {
        "dump": {
            completed: false,
        },
        "deadline": {
            completed: false
        },
        "classify": {
            completed: false
        },
        "specify": {
            completed: false
        },
        "dependencies": {
            completed: false
        },
        "sequence": {
            completed: false
        },
        "documentation": {
            completed: false
        }
    });

let storeSteps = get(stepsCompleted);

export function getStepById(stepId) {
    let step = get(steps).find((step) => step.id === stepId);
    if (step) {
        step.active = storeSteps[stepId].active;
        step.completed = storeSteps[stepId].completed;
        return step;
    }
    return null;
}

export function getActiveStep() {
    for (const key in storeSteps) {
        const step = storeSteps[key];
        if (step.active) {
            return step;
        }
    }
    return null;
}

export function setStepCompleted(stepId, completed) {
    try {
        storeSteps[stepId].completed = completed;
        getStepById(stepId).completed = completed;

    } catch (error) { }
}


export let steps = writable([
    {
        step: 0,
        id: 'dump',
        linkText: '1. Dump & Cluster',
        h1: 'Dump & Cluster',
        link: '/scopes/dump',
        completed: storeSteps["dump"].completed
    },
    {
        step: 1,
        id: 'deadline',
        linkText: '2. Deadline',
        h1: 'Set a deadline',
        link: '/scopes/deadline',
        completed: storeSteps["deadline"].completed
    },

    {
        step: 2,
        id: 'classify',
        linkText: '3. Classify',
        h1: 'Classify',
        link: '/scopes/classify',
        completed: storeSteps["classify"].completed
    },
    {
        step: 3,
        id: 'specify',
        linkText: '4. Specify',
        h1: 'Specify',
        link: '/scopes/specify',
        completed: storeSteps["specify"].completed

    },
    {
        step: 4,
        id: 'dependencies',
        linkText: '5. Set Dependencies',
        h1: 'Set Dependencies',
        link: '/scopes/dependencies',
        completed: storeSteps["dependencies"].completed
    },
    {
        step: 5,
        id: 'sequence',
        linkText: '6. Get Sequence',
        h1: 'Get Sequence',
        link: '/scopes/sequence',
        completed: storeSteps["sequence"].completed
    },
    {
        step: 6,
        id: 'documentation',
        linkText: '7. (optional) Create Document',
        h1: 'Requirements Documentation',
        h2: 'Create requirements documentation',
        link: '/scopes/documentation',
        completed: storeSteps["documentation"].completed
    }
]);
