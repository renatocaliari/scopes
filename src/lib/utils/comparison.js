import { deepCopy } from '$lib/utils/general.js'


export function normalizeId(id) {
    let arrId = id.split("-");
    return arrId[0] + "-" + arrId[1];
}
/**
 * scopes forked has random id. 
 * each time you enter the screen of sequence it gets a new random id,
 * so, it will be different from what is stored in the store
 * even the sequence and info remaining the same.
 * so, it's important to normalize when you want to compare
 * @param {GroupScopes[]} groups 
 */
export function normalizeScopesToCompare(groups) {
    return deepCopy(groups).map((group) => {
        group.items = group.items.map((scope) => {
            scope.id = normalizeId(scope.id);
            if (scope.dependsOn.length) {
                scope.dependsOn = scope.dependsOn.map((id) => {
                    id = normalizeId(id);
                    return id;
                })
            }
            return scope;
        })
        return group;
    })
}

export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2 && (!Array.isArray(val1) && !Array.isArray(val2))

        ) {
            return false;
        } else if (Array.isArray(val1) && Array.isArray(val2)) {
            for (const [idx, item] of val1.entries()) {
                if (!deepEqual(item, val2[idx])) {
                    return false;
                }
            }
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}
