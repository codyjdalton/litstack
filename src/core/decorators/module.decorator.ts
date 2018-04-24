/**
 * @TODO move this into its own file!
 */
interface ServiceModuleConfig {
    path: string;
}

/**
 * @annotation LitModule
 * @param {ServiceModuleConfig} config
 */
export function LitModule(config: ServiceModuleConfig): ClassDecorator {
    return (target): any => {
        // add module code here
        return target;
    }
}