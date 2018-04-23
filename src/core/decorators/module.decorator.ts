/**
 * @TODO move this into its own file!
 */
interface ServiceModuleConfig {
    path: string;
}

/**
 * @annotation ServiceModule
 * @param {ServiceModuleConfig} config
 */
export function ServiceModule(config: ServiceModuleConfig): ClassDecorator {
    return (target): any => {
        // add module code here
        return target;
    }
}