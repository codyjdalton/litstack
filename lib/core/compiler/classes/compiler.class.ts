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

        this.addExports(Parent);

        // and finally, listen on port 3000
        this.app.listen(port, this.greet(port));
    }

    greet(port: string | number = ''): Function {
        return () => {
            this.console.log("Application running on port " + port);
        }
    }

    addExports(Parent: any): void {
        
        const path = Injector.get(Parent, 'path', '');
        const imports = Injector.get(Parent, 'imports', []);

        // add parent imports first
        this.addExportedComponents(path, Injector.get(Parent, 'exports', []));

        imports.forEach((Child: any) => {

            // and then register child imports...
            this.addExportedComponents(
                Injector.get(Child, 'path', ''),
                Injector.get(Child, 'exports', [])
            );
        });
    }

    addHandler(aComponent: any, name: string) {
        return (req: any, res: any) => {
            aComponent[name](req, new HttpResponse(res));
        };
    }

    addRoute(method: string, path: string, aComponent: any, name: string): void {
        this.app[method]('/' + path, this.addHandler(aComponent, name));
    }

    addRouteFromMethod(Component: any, method: string, path: string) {

        // get a new instance of the component
        const aComponent: any = Injector.resolve(Component);
        const reqMethod: string = Injector.get(aComponent, 'method', null, method);

        // check if method is elligible for route and add
        if(reqMethod) {

            let newPath: string = Injector.get(aComponent, 'path', null, method);

            // @TODO, build this path more intelligently...
            if(newPath) {
                path = path + '/' + newPath;
            }
            
            this.addRoute(reqMethod, path, aComponent, method);
        }
    }

    addExportedComponents(path: string, includes: any[]): void {
        includes.forEach(
            (Component: any) => {
                this.getMethodList(Component).forEach(
                    (method: string) => this.addRouteFromMethod(Component, method, path)
                );
            } 
        );
    }

    getMethodList(target: any): string[] {
        return Object.getOwnPropertyNames(target.prototype)
                     .filter(
                        (name: string) => name !== 'constructor'
                     );
    }
}

export const LitCompiler: ServiceCompiler = Injector.resolve(ServiceCompiler);