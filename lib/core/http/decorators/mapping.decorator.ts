/**
 * mapping.decorator
 * Package and class imports
 */
import { definePropFactory } from '../../compiler/factories/define-prop.factory';
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { Injector } from "../../compiler/classes/injector.class";

import { RequestMapping } from '../models/request-mapping.model';


/**
 * Create generic request mapping method
 */
 const GenericMapping = (type: 'get' | 'put' | 'post' | 'patch' | 'delete') => {
    return (config: RequestMapping = {}) : MethodDecorator => {
        return (target: Type<any>, propertyKey: string, descriptor: PropertyDescriptor) => {
    
          config.method = type;
      
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
};

export const GetMapping = GenericMapping('get');
export const PostMapping = GenericMapping('post');
export const PutMapping = GenericMapping('post');
export const PatchMapping = GenericMapping('patch');
export const DeleteMapping = GenericMapping('delete');