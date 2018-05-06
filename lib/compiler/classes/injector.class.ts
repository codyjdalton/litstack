import 'reflect-metadata';

import { GenericClassDecorator, Type } from "../../utils/core.util";
/**
 * The Injector stores services and resolves requested instances.
 */
export const Injector = new class {

  /**
   * Resolves instances by injecting required services
   * @param {Type<any>} target
   * @returns {T}
   */
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [],
      injections = tokens.map(token => Injector.resolve<any>(token));

    return new target(...injections);
  }

  /**
   * Stores a service in the Injector
   * @param {Type<any>} target
   */
  set(target: Type<any>, config: Object = {}, propertyKey: string = null) {
    Object.keys(config).forEach(
      (key: string) => Reflect.defineMetadata(key, config[key], target, propertyKey ? propertyKey : undefined)
    );
  }

  /**
   * @function get
   * @param {Type<any>} target 
   * @param {string} key 
   * @param {any} defaultValue 
   */
  get(target: Type<any>, key: string, defaultValue: any = null, propertyKey: string = null): any {
    return Reflect.hasMetadata(key, target, propertyKey ? propertyKey : undefined) ?
           Reflect.getMetadata(key, target, propertyKey ? propertyKey : undefined) :
           defaultValue;
  }

  /**
   * @function getAll
   * @param target 
   * @param propertyKey
   * 
   * Return all values from a given object
   */
  getAll(target: Type<any>, propertyKey: string): Object {
    return Reflect.getMetadataKeys(target, propertyKey).reduce(
      (result: Object, key: string): Object => {
        result[key] = this.get(target, key, undefined, propertyKey)
        return result;
      }, {}
    );
  }
};