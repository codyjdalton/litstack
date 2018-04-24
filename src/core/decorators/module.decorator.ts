import { definePropFactory } from '../factories/define-prop.factory';

/**
 * @TODO move this into its own file!
 */
interface LitModuleConfig {
    path?: string;
    imports?: any[];
    exports?: any[];
}

/**
 * @Annotation LitModule
 * @param {ServiceModuleConfig} config
 */
export function LitModule(config: LitModuleConfig = null): ClassDecorator {
    return (target): any => {
        Object.keys(config).forEach(
            (key: string) => definePropFactory(
                target.prototype,
                key,
                config[key]
            )
        );
    }
}