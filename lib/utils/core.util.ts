/**
 * Object instance type
 */
export type Type<T> = new(...args: any[]) => T;

/**
 * Generic `ClassDecorator` type
 */
export type GenericClassDecorator<T> = (target: T) => void;
