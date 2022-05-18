//https://www.eternaldev.com/blog/how-to-write-tests-in-sveltekit-and-vitest/
//https://www.thisdot.co/blog/testing-with-vitest
//https://github.com/vitest-dev/vitest

//https://mtm.dev/svelte-vite-aliases

import { scenarioRolesMapper, scenario2 } from './scenarioSequence.js'
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import {
    storeSortedGroupedSequenceScopes,
    ProjectStore
} from './projectStore';
import { get } from 'svelte/store';

describe("Sequence", () => {
    it("check the a sequence of scopes with scenario 2", () => {
        let projectStoreTest = ProjectStore(scenario2);
        projectStoreTest.sortScopesByPriority();
        let lengthArr = get(storeSortedGroupedSequenceScopes).length;

        expect(projectStoreTest).not.toBeUndefined(get(storeSortedGroupedSequenceScopes));

        expect(scenario2.length).toBe(10);
        expect(projectStoreTest.length).toBe(10);
        expect(lengthArr).toBe(10);
        expect(get(storeSortedGroupedSequenceScopes)[0].items[0].id).toBe('scope-3');
        expect(get(storeSortedGroupedSequenceScopes)[0].items[1].forkedScopeId).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)[0].items[2].id).toBe('scope-2');
        expect(get(storeSortedGroupedSequenceScopes)[1].items[0].id).toBe('scope-5');
        expect(get(storeSortedGroupedSequenceScopes)[2].items[0].id).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)[3].items[0].id).toBe('scope-6');
        expect(get(storeSortedGroupedSequenceScopes)[3].items[1].id).toBe('scope-7');
        expect(get(storeSortedGroupedSequenceScopes)[4].items[0].id).toBe('scope-4');
        expect(get(storeSortedGroupedSequenceScopes)[5].items[0].id).toBe('scope-3');
        expect(get(storeSortedGroupedSequenceScopes)[5].items[1].forkedScopeId).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)[5].items[2].id).toBe('scope-2');
        expect(get(storeSortedGroupedSequenceScopes)[6].items[0].id).toBe('scope-5');
        expect(get(storeSortedGroupedSequenceScopes)[7].items[0].id).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)[8].items[0].id).toBe('scope-6');
        expect(get(storeSortedGroupedSequenceScopes)[8].items[1].id).toBe('scope-7');
        expect(get(storeSortedGroupedSequenceScopes)[9].items[0].id).toBe('scope-4');
    })


    it("check the a sequence of scopes with scenario RolesMapper", () => {
        let projectStoreTest = ProjectStore(scenarioRolesMapper);
        projectStoreTest.sortScopesByPriority();
        let lengthArr = get(storeSortedGroupedSequenceScopes).length;

        expect(projectStoreTest).not.toBeUndefined(get(storeSortedGroupedSequenceScopes));

        expect(scenarioRolesMapper.length).toBe(10);
        expect(projectStoreTest.length).toBe(10);
        expect(lengthArr).toBe(4);
        expect(get(storeSortedGroupedSequenceScopes)[0].items[0].id).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)[0].items[1].forkedScopeId).toBe('scope-2');
        expect(get(storeSortedGroupedSequenceScopes)[0].items[2].id).toBe('scope-5');
        expect(get(storeSortedGroupedSequenceScopes)[1].items[0].id).toBe('scope-2');
        expect(get(storeSortedGroupedSequenceScopes)[1].items[1].id).toBe('scope-4');
        expect(get(storeSortedGroupedSequenceScopes)[2].items[0].id).toBe('scope-3');
        expect(get(storeSortedGroupedSequenceScopes)[3].items[0].id).toBe('scope-6');
    })

})