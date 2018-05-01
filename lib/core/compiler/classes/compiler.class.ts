import * as express from 'express';
import { Express } from 'express';
import * as BodyParser from 'body-parser';

import { Injector } from './injector.class';
import { HttpResponse } from '../../http/classes/response.class';

export class ServiceCompiler {

    app: Express = express();
    
    bootstrap(Parent: any, port: number = 3000): void {

        // add body parser support
        // parse application/x-www-form-urlencoded
        this.app.use(BodyParser.urlencoded({ extended: false }));

        // parse application/json
        this.app.use(BodyParser.json());

        // instantiate the parent module
        const aParent = new Parent();

        this.addImportedRoutes(aParent);

        // and finally, listen on port 3000
        this.app.listen(process.env.port || port, () => {
            console.log("Application running on port " + port);
        });
    }

    addImportedRoutes(Parent: any): void {
        
        const path = Parent.path || '';
        const imports = Parent.imports || [];

        this.addExportedComponents(Parent.path || '', Parent.exports);

        imports.forEach((Child: any) => {
            
            const aChild: any = Injector.resolve(Child);

            // we are at the child module level...
            // now we need to add component routes...
            this.addExportedComponents(aChild.path || '', aChild.exports);
        });
    }

    addRoute(method: string, path: string, aComponent: any, name: string): void {
        this.app[method]('/' + path, (req, res) => {
            aComponent[name](req, new HttpResponse(res))
        });
    }

    addExportedComponents(path, exports: any[]): void {
        exports.forEach(
            (Component) => {
                
                const aComponent: any = Injector.resolve(Component);

                const props: string[] = this.getInstanceMethodNames(aComponent);

                props.forEach(
                    (method: string) => {

                        // check if method is elligible for route and add
                        if(aComponent[method].method) {

                            let newPath = path;

                            if(aComponent[method].path) {
                                newPath = newPath + '/' + aComponent[method].path;
                            }
                            
                            this.addRoute(aComponent[method].method, newPath, aComponent, method);
                        }
                    }
                );
            } 
        );
    }

    hasMethod (obj, name) {
        const desc = Object.getOwnPropertyDescriptor(obj, name);
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

export const LitCompiler: ServiceCompiler = new ServiceCompiler();