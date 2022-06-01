//https://www.eternaldev.com/blog/how-to-write-tests-in-sveltekit-and-vitest/
//https://www.thisdot.co/blog/testing-with-vitest
//https://github.com/vitest-dev/vitest

//https://mtm.dev/svelte-vite-aliases

import { scenarioRolesMapper, scenario2 } from './scenarioSequence.js'
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import {
    ProjectStore
} from './projectStore';
import { get } from 'svelte/store';

let sortedGroupedSequenceScopes;

describe("Sequence", () => {
    it("check the a sequence of scopes with scenario 2", () => {
        let projectStoreTest = ProjectStore(scenario2);
        ({ sortedGroupedSequenceScopes } = projectStoreTest.sortScopesByPriority());
        let lengthArr = sortedGroupedSequenceScopes.length;

        expect(projectStoreTest).not.toBeUndefined(sortedGroupedSequenceScopes);

        expect(scenario2.length).toBe(10);
        expect(projectStoreTest.length).toBe(10);
        expect(lengthArr).toBe(10);
        expect(sortedGroupedSequenceScopes[0].items[0].id).toBe('scope-3');
        expect(sortedGroupedSequenceScopes[0].items[1].forkedScopeId).toBe('scope-1');
        expect(sortedGroupedSequenceScopes[0].items[2].id).toBe('scope-2');
        expect(sortedGroupedSequenceScopes[1].items[0].id).toBe('scope-5');
        expect(sortedGroupedSequenceScopes[2].items[0].id).toBe('scope-1');
        expect(sortedGroupedSequenceScopes[3].items[0].id).toBe('scope-6');
        expect(sortedGroupedSequenceScopes[3].items[1].id).toBe('scope-7');
        expect(sortedGroupedSequenceScopes[4].items[0].id).toBe('scope-4');
        expect(sortedGroupedSequenceScopes[5].items[0].id).toBe('scope-3');
        expect(sortedGroupedSequenceScopes[5].items[1].forkedScopeId).toBe('scope-1');
        expect(sortedGroupedSequenceScopes[5].items[2].id).toBe('scope-2');
        expect(sortedGroupedSequenceScopes[6].items[0].id).toBe('scope-5');
        expect(sortedGroupedSequenceScopes[7].items[0].id).toBe('scope-1');
        expect(sortedGroupedSequenceScopes[8].items[0].id).toBe('scope-6');
        expect(sortedGroupedSequenceScopes[8].items[1].id).toBe('scope-7');
        expect(sortedGroupedSequenceScopes[9].items[0].id).toBe('scope-4');
    })


    it("check the a sequence of scopes with scenario RolesMapper", () => {
        let projectStoreTest = ProjectStore(scenarioRolesMapper);
        ({ sortedGroupedSequenceScopes } = projectStoreTest.sortScopesByPriority());
        let lengthArr = sortedGroupedSequenceScopes.length;

        expect(projectStoreTest).not.toBeUndefined(sortedGroupedSequenceScopes);

        expect(scenarioRolesMapper.length).toBe(10);
        expect(projectStoreTest.length).toBe(10);
        expect(lengthArr).toBe(4);
        expect(sortedGroupedSequenceScopes[0].items[0].id).toBe('scope-1');
        expect(sortedGroupedSequenceScopes[0].items[1].forkedScopeId).toBe('scope-2');
        expect(sortedGroupedSequenceScopes[0].items[2].id).toBe('scope-5');
        expect(sortedGroupedSequenceScopes[1].items[0].id).toBe('scope-2');
        expect(sortedGroupedSequenceScopes[1].items[1].id).toBe('scope-4');
        expect(sortedGroupedSequenceScopes[2].items[0].id).toBe('scope-3');
        expect(sortedGroupedSequenceScopes[3].items[0].id).toBe('scope-6');
    })

})