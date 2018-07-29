/**
 * compiler.class
 */
import BodyParser = require('body-parser');
import express = require('express');

import { Application, RequestHandler } from 'express';

import { Injector } from 'super-injector';
import { HttpRequest, HttpResponse } from '../../http';
import { RequestMethod } from '../../http/enums/request-method.enum';
import { HttpNext } from '../../http/models/next.model';
import { HttpServer } from '../../http/utils/http.utils';
import { DefaultComponent } from '../components/default.component';
import { CoreCompiler, ILitComponent, ILitModule } from '../utils/compiler.utils';

export class ServiceCompiler extends CoreCompiler {

    protected app: Application = express();
    protected server: HttpServer;

    /**
     * @function bootstrap
     * @param {ILitModule} parent - Usually the app.module
     * @param {string | number} port - defaults to 3000
     *
     * Usage:
     * @LitModule()
     * class AppComponent {}
     *
     * LitCompiler.bootstrap(AppComponent)
     */
    public bootstrap(parent: ILitModule, port: string | number | null = 3000): void {

        // 1. Add parser
        this.addParser();

        // 2. unpack the parent module
        this.unpack(parent);

        // 3. start the app
        this.listen(port);
    }

    /**
     * @function listen
     * @param {string | number} port
     * Usage:
     * Litcompiler.listen()
     */
    private listen(port: string | number | null): void {

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
     * @param {ILitModule} parent
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

        imports.forEach((child: ILitModule) => this.unpack(child, path));
    }

    /**
     * @function getMethodList
     * @param {ILitComponent} component
     * @returns {string[]}
     */
    private getMethodList(component: ILitComponent): string[] {
        return Object.getOwnPropertyNames(component.prototype)
                     .filter(
                        (name: string) => name !== 'constructor' // <-- maybe someday
                     );
    }

    /**
     * @function getPath
     * @param {Array<string | null | undefined>} parts
     * @returns {string}
     * Usage:
     * LitCompiler.getPath(['some', '', 'path']);
     *
     * returns: 'some/path'
     */
    private getPath(parts: Array<string | null | undefined>): string {
        return parts.filter(
            (part) => part
        ).join('/');
    }

    /**
     * @function getHandler
     * @param {ILitComponent} component
     * @param {string} name
     * @returns {RequestHandler}
     */
    private getHandler(component: ILitComponent, name: string): RequestHandler {
        return (req: HttpRequest,
                res: express.Response,
                next: HttpNext): RequestHandler => {

            const meta: object = Injector.getAll(
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
     * @param {RequestMethod} method
     * @param {string} path
     * @param {ILitComponent} component
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

        // method could be user input, sanitize it
        const aMethod: string = method.toLowerCase();

        this.app[aMethod]('/' + path, this.getHandler(component, name));
    }

    /**
     * @function addRouteFromMethod
     * @param {ILitComponent} component
     * @param {name} method
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
    private addRouteFromMethod(component: ILitComponent, name: string, path: string): void {

        const reqMethod: RequestMethod = Injector.get(
            component.prototype,
            'method',
            null,
            name
        );

        // check if method is elligible for route and add
        if (reqMethod) {

            path = this.getPath([
                path,
                Injector.get(component.prototype, 'path', null, name)
            ]);

            this.addRoute(reqMethod, path, component, name);
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
     * @param {string | number} port
     * Usage:
     * LitCompiler.greet(1000)()
     *
     * logs: Application running on port 1000
     */
    private greet(port: string | number | null): () => void {
        return (): void => {
            this.console.log('Application running on port ' + port);
        };
    }
}

export const LitCompiler: ServiceCompiler = Injector.resolve(ServiceCompiler);
