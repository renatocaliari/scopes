import { writable as writableLocal } from 'svelte-local-storage-store'
import { writable } from 'svelte/store';
import { get } from 'svelte/store';

export const stepsCompleted = writableLocal('steps',
    {
        "dump": {
            active: false,
            completed: false,
        },
        "deadline": {
            active: false,
            completed: false
        },
        "classify": {
            active: false,
            completed: false
        },
        "specify": {
            active: false,
            completed: false
        },
        "dependencies": {
            active: false,
            completed: false
        },
        "sequence": {
            active: false,
            completed: false
        },
        "documentation": {
            active: false,
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

export function setStepActive(stepId) {

    for (const key in storeSteps) {
        const step = storeSteps[key];
        step.active = key === stepId;
        getStepById(stepId).active = key === stepId;
        console.log('stepId:', stepId);
        console.log('step.active:', step.active);
        console.log('getStepById(stepId).active:', getStepById(stepId).active);

        //        getStepById(stepId).active = key === stepId;
    }
    console.log(storeSteps);
}



export let steps = writable([
    {
        step: 0,
        id: 'dump',
        linkText: 'Dump & Cluster',
        h1: 'Dump & Cluster',
        link: '/scopes/dump',
        active: storeSteps["dump"].active,
        completed: storeSteps["dump"].completed
    },
    {
        step: 1,
        id: 'deadline',
        linkText: 'Deadline',
        h1: 'Set a deadline',
        link: '/scopes/deadline',
        active: storeSteps["deadline"].active,
        completed: storeSteps["deadline"].completed
    },

    {
        step: 2,
        id: 'classify',
        linkText: 'Classify',
        h1: 'Classify',
        link: '/scopes/classify',
        active: storeSteps["classify"].active,
        completed: storeSteps["classify"].completed
    },
    {
        step: 3,
        id: 'specify',
        linkText: 'Specify',
        h1: 'Specify',
        link: '/scopes/specify',
        active: storeSteps["specify"].active,
        completed: storeSteps["specify"].completed

    },
    {
        step: 4,
        id: 'dependencies',
        linkText: 'Set Dependencies',
        h1: 'Set Dependencies',
        link: '/scopes/dependencies',
        active: storeSteps["dependencies"].active,
        completed: storeSteps["dependencies"].completed
    },
    {
        step: 5,
        id: 'sequence',
        linkText: 'Get Sequence',
        h1: 'Sequence',
        link: '/scopes/sequence',
        active: storeSteps["sequence"].active,
        completed: storeSteps["sequence"].completed
    },
    {
        step: 6,
        id: 'documentation',
        linkText: 'Create Documentation',
        h1: 'Documentation',
        h2: 'Create documentation to other people that will execute it',
        link: '/scopes/documentation',
        active: storeSteps["documentation"].active,
        completed: storeSteps["documentation"].completed
    }
]);
