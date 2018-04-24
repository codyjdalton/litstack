import { definePropFactory } from '../factories/define-prop.factory';
/**
 * @TODO move this into its own file!
 */
interface RequestMapping {
    path?: string;
}

// @TODO: stuff in these
/**
 * @param {RequestMapping} config
 */
export function GetMapping(config: RequestMapping = null): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        definePropFactory(
            target[propertyKey],
            'method',
            'get'
        )
        if(config) {
            Object.keys(config).forEach(
                (key: string) => definePropFactory(
                    target[propertyKey],
                    key,
                    config[key]
                )
            );
        }
    }
}