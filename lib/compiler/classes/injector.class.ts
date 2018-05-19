import "reflect-metadata";

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
  public resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    const tokens: Array<Type<any>> = Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = tokens.map((token) => Injector.resolve<any>(token));

    return new target(...injections);
  }

  /**
   * Stores a service in the Injector
   * @param {Type<any>} target
   */
  public set(target: Type<any>, config: object = {}, propertyKey: any = null): void {
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
  public get(target: Type<any>, key: string, defaultValue: any = null, propertyKey: any = null): any {
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
  public getAll(target: Type<any>, propertyKey: string): object {
    return Reflect.getMetadataKeys(target, propertyKey).reduce(
      (result: object, key: string): object => {
        result[key] = this.get(target, key, undefined, propertyKey);
        return result;
      }, {}
    );
  }

  public getParams(target: Type<any>, propertyKey: string) {
    return Reflect.getMetadata("design:paramtypes", target.prototype, propertyKey) || [];
  }
};
