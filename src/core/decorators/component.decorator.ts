/**
 * @annotation LitComponent
 * @param {any} config
 */
export function LitComponent(config: any = null): ClassDecorator {
    return (target): any => {
        // add module code here
        return target;
    }
}