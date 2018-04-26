import { definePropFactory } from '../factories/define-prop.factory';
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { Injector } from "./../classes/injector.class";

/**
 * @TODO move this into its own file!
 */
interface RequestMapping {
    path?: string;
    method?: string;
}

export const GetMapping = (config: RequestMapping = {}) : MethodDecorator => {
    return (target: Type<any>, propertyKey: string, descriptor: PropertyDescriptor) => {

      config.method = 'get';
  
      Object.keys(config).forEach(
          (key: string) => definePropFactory(
              target[propertyKey],
              key,
              config[key]
          )
      );

      Injector.set(target);
    };
  };