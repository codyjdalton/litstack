import * as express from 'express';
import { Express } from 'express';
import "reflect-metadata";

interface Type<T> {
  new(...args: any[]): T;
}

const Injector = new class {
  // A map where all registered services will be stored
  protected services: Map<string, Type<any>> = new Map<string, Type<any>>();
  
  // resolving instances
  resolve<T>(target: Type<any>): T {
    // tokens are required dependencies, while injections are resolved tokens from the Injector
    let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
        injections = tokens.map(token => Injector.resolve<any>(token));
    
    return new target(...injections);
  }
  
  // store services within the injector
  set(target: Type<any>) {
    this.services.set(target.name, target);
  }
};

class ServiceCompiler {

    app: Express;
    
    bootstrap(Parent: any, port: number = 3000): void {

        // create an express app
        this.app = express();

        // instantiate the parent module
        const aParent = Injector.resolve<any>(Parent);

        this.addImportedRoutes(aParent);

        // and finally, listen on port 3000
        this.app.listen(process.env.port || port);
    }

    addImportedRoutes(Parent: any): void {
        
        const path = Parent.path || '';
        const imports = Parent.imports || [];

        this.addExportedComponents(Parent.path || '', Parent.exports);

        imports.forEach((Child: any) => {
            
            const aChild = Injector.resolve<any>(Child);

            // we are at the child module level...
            // now we need to add component routes...
            this.addExportedComponents(aChild.path || '', aChild.exports);
        });
    }

    addRoute(method: string, path: string, cb: Function): void {
        this.app[method]('/' + path, (req, res) => {
            cb(req, res);
        });
    }

    addExportedComponents(path, exports: any[]): void {
        exports.forEach(
            (Component) => {
                
                const aComponent = Injector.resolve<any>(Component);
                const props: string[] = this.getInstanceMethodNames(aComponent);

                props.forEach(
                    (method: string) => {
                        // check if method is elligible for route and add
                        if(aComponent[method].method) {

                            let newPath = path;

                            if(aComponent[method].path) {
                                newPath = newPath + '/' + aComponent[method].path;
                            }
                            
                            this.addRoute(aComponent[method].method, newPath, aComponent[method]);
                        }
                    }
                );
            } 
        );
    }

    hasMethod (obj, name) {
        const desc = Object.getOwnPropertyDescriptor (obj, name);
        return !!desc && typeof desc.value === 'function';
    }

    getInstanceMethodNames(obj, stop = null) {
        let array = [];
        let proto = Object.getPrototypeOf (obj);
        while (proto && proto !== stop) {
          Object.getOwnPropertyNames (proto)
            .forEach (name => {
              if (name !== 'constructor') {
                if (this.hasMethod (proto, name)) {
                  array.push (name);
                }
              }
            });
          proto = Object.getPrototypeOf (proto);
        }
        return array;
      }
}

export const serviceCompiler: ServiceCompiler = new ServiceCompiler();