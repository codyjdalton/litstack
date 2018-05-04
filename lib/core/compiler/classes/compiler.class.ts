import * as express from 'express';
import { Express } from 'express';
import * as BodyParser from 'body-parser';

import { Injector } from './injector.class';
import { HttpResponse } from '../../http/classes/response.class';

export class ServiceCompiler {

    console: any = console;
    app: Express = express();
    
    bootstrap(Parent: any, port: string | number = 3000): void {

        // override port
        port = process.env.port || port;

        // add body parser support
        // parse application/x-www-form-urlencoded
        this.app.use(BodyParser.urlencoded({ extended: false }));

        // parse application/json
        this.app.use(BodyParser.json());

        this.addExports(
            Injector.resolve(Parent)
        );

        // and finally, listen on port 3000
        this.app.listen(port, this.greet(port));
    }

    greet(port: string | number = ''): Function {
        return () => {
            this.console.log("Application running on port " + port);
        }
    }

    addExports(Parent: any): void {
        
        const path = Parent.path || '';
        const imports = Parent.imports;

        this.addExportedComponents(path, Parent.exports);

        imports.forEach((Child: any) => {
            
            const aChild: any = Injector.resolve(Child);

            // we are at the child module level...
            // now we need to add component routes...
            this.addExportedComponents(aChild.path || '', aChild.exports);
        });
    }

    addRoute(method: string, path: string, aComponent: any, name: string): void {
        this.app[method]('/' + path, this.addHandler(aComponent, name));
    }

    addHandler(aComponent: any, name: string) {
        return (req: any, res: any) => {
            aComponent[name](req, new HttpResponse(res));
        };
    }

    addExportedComponents(path: string, includes: any[]): void {
        includes.forEach(
            (Component) => {
                
                const aComponent: any = Injector.resolve(Component);

                const props: string[] = this.getInstanceMethodNames(aComponent);

                props.forEach(
                    (method: string) => {

                        // check if method is elligible for route and add
                        if(aComponent[method].method) {

                            let newPath = path;

                            // @TODO, build this path more intelligently...
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

export const LitCompiler: ServiceCompiler = Injector.resolve(ServiceCompiler);