/**
 * mapping.decorator
 * Package and class imports
 */
import { definePropFactory } from '../../compiler/factories/define-prop.factory';
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { Injector } from "../../compiler/classes/injector.class";

import { RequestMapping } from '../models/request-mapping.model';

/**
 * Function declarationg
 */
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