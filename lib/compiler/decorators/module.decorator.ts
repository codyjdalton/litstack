/**
 * module.decorator
 */
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { ILitComponent, ILitModule } from "../utils/compiler.utils";
import { Injector } from "./../classes/injector.class";

/**
 * @TODO move this into its own file!
 */
export interface LitModuleConfig {
  path?: string;
  imports?: ILitModule[];
  exports?: ILitComponent[];
}

/**
 * Classes decorated with the `@LitModule` decorator are stored within the injector and can be resolved by it.
 * @returns {GenericClassDecorator<Type<any>>}
 * @constructor
 */
export const LitModule = (config: LitModuleConfig = {}): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>): void => {

    config.path = config.path || "";
    config.imports = config.imports || [];
    config.exports = config.exports || [];

    Injector.set(target, config);
  };
};
