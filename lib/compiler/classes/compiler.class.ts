/**
 * compiler.class
 */
import express = require('express');
import BodyParser = require('body-parser');

import { Application, RequestHandler } from 'express';

import { CoreCompiler, ILitComponent, ILitModule } from '../utils/compiler.utils';
import { DefaultComponent } from '../components/default.component';
import { HttpServer } from '../../http/utils/http.utils';
import { HttpResponse } from '../../http/classes/response.class';
import { HttpNext } from '../../http/models/next.model';
import { Injector } from './injector.class';
import { RequestMethod } from '../../http/enums/request-method.enum';

export class ServiceCompiler extends CoreCompiler {

    protected app: Application = express();
    protected server: HttpServer;

    /**
     * @function bootstrap
     * @param {ILitModule} Parent - Usually the app.module
     * @param {number} port - defaults to 3000
     * 
     * Usage:
     * @LitModule()
     * class AppComponent {}
     * 
     * LitCompiler.bootstrap(AppComponent)
     */
    bootstrap(parent: ILitModule, port: string | number = 3000): void {

        // 1. Add parser
        this.addParser();

        // 2. unpack the parent module
        this.unpack(parent);

        // 3. start the app
        this.listen(port);
    }

    /**
     * @function listen
     * @param {number} port
     * Usage:
     * Litcompiler.listen()
     */
    private listen(port: string | number): void {

        this.server = this.app.listen(port, this.greet(port));
    }

    /**
     * @function addParser
     * Usage:
     * LitCompiler.addParser();
     * 
     * Adds body parser to this.app
     */
    private addParser(): void {

        // add body parser support
        // parse application/x-www-form-urlencoded
        this.app.use(BodyParser.urlencoded({ extended: false }));

        // parse application/json
        this.app.use(BodyParser.json());
    }

    /**
     * @function unpack
     * @param {GenericModule} Parent 
     * @param {path} inputPath
     */
    private unpack(parent: ILitModule, inputPath: string = ''): void {
        
        const path = this.getPath([
            inputPath,
            Injector.get(parent, 'path', '')
        ]);
        const imports = Injector.get(parent, 'imports', []);

        // add parent imports first
        this.addExportedComponents(path, Injector.get(parent, 'exports', []));

        imports.forEach((Child: ILitModule) => this.unpack(Child, path));
    }

    /**
     * @function getMethodList
     * @param {ILitComponent} target
     */
    private getMethodList(component: ILitComponent): string[] {
        return Object.getOwnPropertyNames(component.prototype)
                     .filter(
                        (name: string) => name !== 'constructor' // <-- maybe someday
                     );
    }

    /**
     * @function getPath
     * @param {string[]} parts
     * Usage:
     * LitCompiler.getPath(['some', '', 'path']);
     * 
     * returns: 'some/path'
     */
    private getPath(parts: (string | null | undefined)[]): string {
        return parts.filter(
            part => part
        ).join('/');
    }

    /**
     * @function getHandler
     * @param {ILitComponent} component 
     * @param {string} name
     */
    private getHandler(component: ILitComponent, name: string): RequestHandler {
        return (req: express.Request, 
                res: express.Response, 
                next: HttpNext): RequestHandler => {

            const meta: Object = Injector.getAll(
                component.prototype,
                name
            );
            const wrappedRes: HttpResponse = new HttpResponse(res, meta);
            const paramLen: number = Injector.getParams(component, name).length;
            const aComponent: ILitComponent = Injector.resolve(component);

            return paramLen === 1 ? aComponent[name](wrappedRes) :
                   paramLen === 2 ? aComponent[name](req, wrappedRes) :
                   paramLen === 3 ? aComponent[name](req, wrappedRes, next) :
                   DefaultComponent.prototype.notImplemented(wrappedRes);
        };
    }
    
    /**
     * @function addRoute
     * @param {string} method 
     * @param {string} path 
     * @param {string} component 
     * @param {string} name
     * Usage:
     * 
     * LitCompiler.addRoute('post', 'some/route' SomeComponent, 'someMethod');
     * 
     * Sets:
     * POST /some/route
     * adds handler SomeComponent.someMethod
     */
    private addRoute(method: RequestMethod, path: string, component: ILitComponent, name: string): void {
        this.app[method]('/' + path, this.getHandler(component, name));
    }

    /**
     * @function addRouteFromMethod
     * @param {ILitComponent} Component 
     * @param {string} method 
     * @param {string} path 
     * 
     * Usage:
     * If SomeComponent has a @GetMapping with a method of 'getStuff'
     * LitCompiler.addRouteFromMethod(SomeComponent, 'getStuff', 'path/to/stuff')
     * 
     * adds route:
     * GET /path/to/stuff
     * SomeComponent.getStuff
     */
    private addRouteFromMethod(component: ILitComponent, method: string, path: string) {

        const reqMethod: RequestMethod = Injector.get(
            component.prototype,
            'method',
            null,
            method
        );

        // check if method is elligible for route and add
        if(reqMethod) {

            path = this.getPath([
                path,
                Injector.get(component.prototype, 'path', null, method)
            ]);
            
            this.addRoute(reqMethod, path, component, method);
        }
    }

    /**
     * @function addExportedComponents
     * @param {string} path 
     * @param {ILitComponent[]} includes 
     * Usage:
     * const moduleExports: LitComponent[] = [ SomeComponent, AnotherComponent ];
     * 
     * // Adds all component routes for each, prefixing the path with 'root'.
     * LitCompiler.addExportedComponents('root', moduleExports);
     */
    private addExportedComponents(path: string, includes: ILitModule[]): void {
        includes.forEach(
            (Component: ILitComponent): void => {
                this.getMethodList(Component).forEach(
                    (method: string): void => this.addRouteFromMethod(Component, method, path)
                );
            } 
        );
    }

    /**
     * @function greet
     * @param {number} port
     * Usage:
     * LitCompiler.greet(1000)()
     * 
     * logs: Application running on port 1000
     */
    private greet(port: string | number): Function {
        return (): void => {
            this.console.log("Application running on port " + port);
        }
    }
}

export const LitCompiler: ServiceCompiler = Injector.resolve(ServiceCompiler);