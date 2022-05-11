//https://www.eternaldev.com/blog/how-to-write-tests-in-sveltekit-and-vitest/
//https://www.thisdot.co/blog/testing-with-vitest
//https://github.com/vitest-dev/vitest

//https://mtm.dev/svelte-vite-aliases

import * as jsonScenario from './scenarioSequence.json'
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import {
    storeSortedGroupedSequenceScopes,
    projectStore
} from './projectStore';
import { get } from 'svelte/store';

describe("Sequence", () => {
    it("creates a sequence of scopes and fork if needed to help risky scopes", () => {
        projectStore.reset(true, 2);
        projectStore.sortScopesByPriority();
        let lengthArr = get(storeSortedGroupedSequenceScopes)['sequence'].length;

        expect(lengthArr).toBe(10);
        expect(get(storeSortedGroupedSequenceScopes)['sequence'][0].items[1].forkedScopeId).toBe('scope-1');
        expect(get(storeSortedGroupedSequenceScopes)['sequence'][lengthArr - 1].items[0].id).toBe('scope-4');
    })
})