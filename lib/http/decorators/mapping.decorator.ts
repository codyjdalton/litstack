/**
 * mapping.decorator
 * Package and class imports
 */
import { GenericClassDecorator, Type } from "../../utils/core.util";
import { Injector } from "../../compiler/classes/injector.class";

import { RequestMapping } from '../models/request-mapping.model';
import { RequestMethod } from '../enums/request-method.enum';

/**
 * Create generic request mapping method
 */
 const GenericMapping = (type: RequestMethod): Function => {
    return (config: RequestMapping = {}) : Function => {
        return (target: Type<any>, propertyKey: string, descriptor: PropertyDescriptor): void => {
    
          config.method = type;
    
          Injector.set(target, config, propertyKey);
        };
    };
};

export const GetMapping = GenericMapping(RequestMethod.GET);
export const PostMapping = GenericMapping(RequestMethod.POST);
export const PutMapping = GenericMapping(RequestMethod.PUT);
export const PatchMapping = GenericMapping(RequestMethod.PATCH);
export const DeleteMapping = GenericMapping(RequestMethod.DELETE);