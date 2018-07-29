/**
 * mapping.decorator
 * Package and class imports
 */
import { Injector } from 'super-injector';
import { GenericClassDecorator, Type } from '../../utils/core.util';

import { RequestMethod } from '../enums/request-method.enum';
import { RequestConfig } from '../models/request-config.model';

/**
 * Create generic request mapping method
 */
const GenericMapping = (type: RequestMethod = RequestMethod.ANY) => {
    return (config: RequestConfig = {}): any => {
        return (target: Type<any>, propertyKey: string, descriptor: PropertyDescriptor): void => {

          if (type !== RequestMethod.ANY) {
            config.method = type;
          }

          Injector.set(target, config, propertyKey);
        };
    };
};

export const GetMapping = GenericMapping(RequestMethod.GET);
export const PostMapping = GenericMapping(RequestMethod.POST);
export const PutMapping = GenericMapping(RequestMethod.PUT);
export const PatchMapping = GenericMapping(RequestMethod.PATCH);
export const DeleteMapping = GenericMapping(RequestMethod.DELETE);
export const RequestMapping = GenericMapping();
