import express = require('express');

import { expect } from 'chai';

import { GetMapping, PostMapping, PutMapping, PatchMapping, DeleteMapping } from '../../http/mappings';
import { Injector } from './injector.class';
import { LitModule, LitComponent } from '../..';
import { ServiceCompiler, LitCompiler } from './compiler.class';

describe('Class: Compiler', () => {

    let compiler: ServiceCompilerStub;

    class ServiceCompilerStub extends ServiceCompiler {

        port: string | number = '';
        meta: string = '';

        constructor() {
            super();

            // we don't want to actually log anything
            // to the console in our spec
            // so we will mock this.console
            this.console = new class {
                log(text: string): void {
                    // ..
                    // add these to a queue or something?
                }
            };
        }

        setMeta(text: string) {
            this.meta = text;
        }

        skipStart() {
            this.start = (port: string | number) => {
                this.port = port;
            }
        }
        
        closeServer() {
            if(this.server) {
                this.server.close();
            }
        }

        findRoutesByPath(path){

            path = '/' + path;
            return this.app._router.stack.filter(
                (item) => item.route &&
                          item.route.path === path
            ).map(
                (item) => {
                    return item.route;
                }
            );
        }

        getRoutePaths(): string[] {
            return this.app._router.stack.filter(
                (item) => item.route && item.route.path
            ).map(
                (item) => {
                    return item.route.path;
                }
            );
        }
    }

    beforeEach(() => {
        
        compiler = Injector.resolve(ServiceCompilerStub);
    });

    afterEach(() => {
        compiler.closeServer();
    });

    it('should allow setting a custom port', () => {
        
        @LitModule()
        class TestModule {

        }

        const testPort = 8080;

        compiler.skipStart();
        
        compiler.bootstrap(TestModule, testPort);
        
        expect(compiler.port).to.equal(testPort);
    });

    it('should start the application with a greeting', () => {
        
        @LitModule()
        class TestModule {

        }

        const expectedGreeting: string = 'Application running on port 3000';
        
        compiler.bootstrap(TestModule, 2000);

        // @TODO test this functionality....
    });

    it('should add component exports', () => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: 'items'
            })
            getItems(req, res) {
                compiler.setMeta('test-input');
            }
        }
        
        @LitModule({
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        compiler.bootstrap(TestModule);

        const routes = compiler.findRoutesByPath('items');

        // a route should be found
        expect(routes.length).to.equal(1);

        // it should be a get request
        expect(routes[0].methods.get).to.be.true;

        // call the handler
        routes[0].stack[0].handle({}, {});

        expect(compiler.meta).to.equal('test-input');
    });

    it('should add module imports', () => {

        @LitComponent()
        class TestComponent {

            @PostMapping({
                path: 'items'
            })
            getItems(req, res) {}
        }
        
        @LitModule({
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        @LitModule({
            path: 'some',
            imports: [
                TestModule
            ]
        })
        class TestAppModule {}

        compiler.bootstrap(TestAppModule);

        const routes = compiler.findRoutesByPath('some/items');

        // a route should be found
        expect(routes.length).to.equal(1);

        // it should be a get request
        expect(routes[0].methods.post).to.be.true;
    });

    it('should only register routes with mapping decorators', () => {

        @LitComponent()
        class TestComponent {

            someUtil() {
                
            }
        }
        
        @LitModule({
            path: 'items',
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        compiler.bootstrap(TestModule);

        const routes = compiler.findRoutesByPath('items');

        expect(routes.length).to.equal(0);
    });

    it('should walk the entire import tree', () => {
        
        @LitComponent()
        class GrandChildComponent {

            @PutMapping({
                path: ':grandchild_id'
            })
            getGrand(req, res) {

            }
        }

        @LitComponent()
        class ChildComponent {
            
            @DeleteMapping()
            getChild(req, res) {
                
            }
        }

        @LitModule({
            path: 'grandchildren',
            exports: [
                GrandChildComponent
            ]
        })
        class GrandChildModule {
        }

        @LitModule({
            path: 'children',
            imports: [
                GrandChildModule
            ]
        })
        class ChildModule {
        }

        @LitModule({
            path: 'parents',
            imports: [
                ChildModule
            ],
            exports: [
                ChildComponent
            ]
        })
        class ParentModule {

        }

        @LitComponent()
        class TestComponent {

            @PostMapping()
            getTest(req, res) {}
        }

        @LitModule({
            exports: [
                TestComponent
            ],
            imports: [
                ParentModule
            ]
        })
        class TestModule {
        }

        const expectedRoutes: string[] = [ 
            '/',
            '/parents',
            '/parents/children/grandchildren/:grandchild_id'
        ];

        compiler.bootstrap(TestModule);

        expect(
            JSON.stringify(compiler.getRoutePaths())
        )
        .to.equal(
            JSON.stringify(expectedRoutes)
        );
    });
  });