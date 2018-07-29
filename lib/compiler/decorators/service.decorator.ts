/**
 * service.decorator
 */
import { Injector } from 'super-injector';
import { GenericClassDecorator, Type } from '../../utils/core.util';

/**
 * Classes decorated with the `@Service` decorator are stored within the injector and can be resolved by it.
 * @returns {GenericClassDecorator<Type<any>>}
 * @constructor
 */
export const LitService = (): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>): void => {
    Injector.set(target, {});
  };
};
