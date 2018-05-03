/**
 * @function definePropFactory
 * @param prototype 
 * @param key 
 * @param val 
 */
export function definePropFactory(prototype: Object, key: string, val: any): void {
    if(val !== undefined) {
        Object.defineProperty(prototype, key, {
            value: val
        });
    }
}