/**
 * mapping.decorator
 * Package and class imports
 */
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { Injector } from "../../compiler/classes/injector.class";

import { RequestMapping } from '../models/request-mapping.model';


/**
 * Create generic request mapping method
 */
 const GenericMapping = (type: 'get' | 'put' | 'post' | 'patch' | 'delete'): Function => {
    return (config: RequestMapping = {}) : Function => {
        return (target: Type<any>, propertyKey: string, descriptor: PropertyDescriptor) => {
    
          config.method = type;
    
          Injector.set(target, config, propertyKey);
        };
    };
};

export const GetMapping = GenericMapping('get');
export const PostMapping = GenericMapping('post');
export const PutMapping = GenericMapping('post');
export const PatchMapping = GenericMapping('patch');
export const DeleteMapping = GenericMapping('delete');