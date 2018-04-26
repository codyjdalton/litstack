import { definePropFactory } from '../factories/define-prop.factory';

/**
 * @TODO move this into its own file!
 */
interface LitModuleConfig {
    path?: string;
    imports?: any[];
    exports?: any[];
}

import { GenericClassDecorator, Type } from "../utils/utils";
import { Injector } from "./../classes/injector.class";

/**
 * Classes decorated with the `@LitModule` decorator are stored within the injector and can be resolved by it.
 * @returns {GenericClassDecorator<Type<any>>}
 * @constructor
 */
export const LitModule = (config: LitModuleConfig = null) : GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {

    Object.keys(config).forEach(
        (key: string) => definePropFactory(
            target.prototype,
            key,
            config[key]
        )
    );
    Injector.set(target);
  };
};