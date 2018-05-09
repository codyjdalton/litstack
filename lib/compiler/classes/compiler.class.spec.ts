import express = require('express');

import { expect } from 'chai';

import { GetMapping, PostMapping } from '../../http/mappings';
import { Injector } from './injector.class';
import { LitModule, LitComponent } from '../..';
import { ServiceCompiler, LitCompiler } from './compiler.class';

describe('Class: Compiler', () => {

    let compiler: ServiceCompiler;

    beforeEach(() => {
        
        compiler = Injector.resolve(ServiceCompiler);
    });

    it('should instantiate a new app on construct', () => {
        
        expect(compiler.app).is.not.undefined;
    });

    it('should listen for incoming requests', () => {
        
        class TestModule {

        }

        compiler.bootstrap(TestModule);

        expect(compiler.server).to.not.be.undefined;

        compiler.server.close();
    });

    it('should start the application and listen on the environment port', () => {
        
        class TestModule {}

        let succeeded: boolean = false;
        const port: number = 4500;

        process.env.port = String(port);

        // override the app listen method
        compiler.app.listen = (a, b): any => {
            if(a == port) {
                succeeded = true;
            }
        };
        compiler.unpack = (aModule) => {};

        compiler.bootstrap(TestModule);

        expect(succeeded).to.be.true;

        delete process.env.port;
    });

    it('should start the application and listen on the default port', () => {
        
        class TestModule {}

        let succeeded: boolean = false;
        const port: number = 3000;

        // override the app listen method
        compiler.app.listen = (a, b): any => {
            if(a === port) {
                succeeded = true;
            }
        };
        compiler.unpack = (aModule) => {};

        compiler.bootstrap(TestModule);

        expect(succeeded).to.be.true;
    });

    it('should start the application and listen on the input port', () => {
        
        class TestModule {}

        let succeeded: boolean = false;
        const port: number = 1000;

        // override the app listen method
        compiler.app.listen = (a, b): any => {
            if(a === port) {
                succeeded = true;
            }
        };
        compiler.unpack = (aModule) => {};


        compiler.bootstrap(TestModule, port);

        expect(succeeded).to.be.true;
    });

    it('should start the application and listen on the input port, greeting the user', () => {
        
        class TestModule {}

        // override the app listen method
        compiler.unpack = (aModule) => {};
        compiler.app.listen = (a, b): any => {
            
            // @TODO check that this was called with the greet method?
            expect(typeof b).to.equal('function');
        };

        compiler.bootstrap(TestModule);

        // mock the console
        compiler.console = new class {

            logged: string | null = null;

            log(text: string): void {
                this.logged = text;
            }
        };

        // manually call the greet method
        compiler.greet()();

        expect(compiler.console.logged).to.not.be.null;
    });

    it('should return a correct path given parts', () => {

        expect(
            compiler.getPath([
                '',
                'some',
                null,
                'test',
                'path'
            ])
        ).to.equal('some/test/path');
    });

    it('should add imported routes from the parent module', () => {
        
        class TestModule {}

        let succeeded: boolean = false;

        // override the unpack method
        compiler.unpack = (aModule) => {
            if(aModule === TestModule) {
                succeeded = true;
            }
        };

        // override the app listen method
        compiler.app.listen = (a, b): any => { return;};

        compiler.bootstrap(TestModule);

        expect(succeeded).to.be.true;
    });

    it('should add dependencies', () => {

        @LitComponent()
        class GrandChildComponent {

            @GetMapping({
                path: ':grandchild_id'
            })
            getGrand(req, res) {

            }
        }

        @LitComponent()
        class ChildComponent {
            
            @GetMapping()
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

        const addedRoutes: any[] = [];
        const expectedRoutes: any[] = [ 
            { path: '', method: 'post', name: 'getTest' },
            { path: 'parents', method: 'get', name: 'getChild' },
            { path: 'parents/children/grandchildren/:grandchild_id',
              method: 'get',
              name: 'getGrand' } 
        ];

        // mock the add route method
        compiler.addRoute = (method: string, path: string, aComponent: any, name: string): void => {
            addedRoutes.push({
                path: path,
                method: method,
                name: name
            });
        };

        compiler.unpack(TestModule);

        expect(
            JSON.stringify(addedRoutes)
        ).to.equal(
            JSON.stringify(expectedRoutes)
        );
    });

    it('should add routes with an empty path and imports if none specified', () => {

        @LitModule()
        class TestModule {

        }

        const addedExports: Object[] = [];

        // mock add exported components
        compiler.addExportedComponents = (path: string, includes: any[]) => {
            addedExports.push({
                path: path,
                includes: includes.map(
                    component => {
                        return Injector.resolve(component)['val'];
                    }
                )
            });
        };

        const expectedExports = [
            {
                path: '',
                includes: []
            }
        ];

        compiler.unpack(Injector.resolve(TestModule));

        expect(
            JSON.stringify(addedExports)
        ).to.equal(
            JSON.stringify(expectedExports)
        );
    });

    it('should add a route with a given method', () => {
        
        class TestComponent {
            
            query(req, res) {}
        }

        compiler.addRouteFromMethod(TestComponent, 'query', 'some-path');

        // @TODO what should be tested here? That a component method was
        // executed, identified, etc?
    });

    it('should add routes to the app', () => {

        class TestComponent {

            // @Mapping() is not needed here as the
            // compiler already has this metadata
            query(req, res) {}
        }

        const testRoutes: { path: string, method: string }[] = [
            {
                path: 'items',
                method: 'get'
            },
            {
                path: 'items/:item_id/transactions/:transaction_id',
                method: 'get'
            },
            {
                path: 'items/:item_id/transactions',
                method: 'get'
            },
            {
                path: 'items/:item_id/transactions',
                method: 'post'
            },
            {
                path: 'items/:id',
                method: 'put'
            },
            {
                path: 'items/:id/other/:other_id',
                method: 'patch'
            },
            {
                path: 'items/:id',
                method: 'delete'
            }
        ]
        
        testRoutes.forEach(
            (route: { path: string, method: string }) => {

                const method = route.method;
                const path = route.path;
                const aComponent: any = Injector.resolve(TestComponent);

                compiler.addRoute(
                    method,
                    path,
                    aComponent,
                    'query'
                );
        
                const stack = compiler.app._router.stack;
        
                const compRoute = stack.filter(
                    (item) => item && 
                              item.route &&
                              item.route.path &&
                              item.route.path === '/' + path &&
                              item.route.methods &&
                              item.route.methods[method]
                )[0] || null;
        
                // path is registered
                expect(compRoute.route.path).to.equal('/' + path);
        
                // request method is correct
                expect(compRoute.route.methods[method]).to.be.true;
            }
        );
    });

    it('should add a handler', () => {

        class TestComponent {

            tested: boolean = false;

            someTest(req, res) {
                if(req && res) {
                    this.tested = true;
                }
            }
        }

        const aTestComponent: any = Injector.resolve(TestComponent);

        expect(aTestComponent.tested).to.be.false;

        compiler.getHandler(aTestComponent, 'someTest')({}, {});

        expect(aTestComponent.tested).to.be.true;
    });

    it('should add a handler with metadata', () => {

        const expectedHeader: string = 'some-val';
        let headerVal: string | null = null;

        class TestComponent {

            headerVal: string = '';

            @GetMapping({
                produces: expectedHeader
            })
            someTest(req, res) {
                
                this.headerVal = res.meta.produces;
            }
        }

        const aTestComponent: any = Injector.resolve(TestComponent);

        compiler.getHandler(aTestComponent, 'someTest')({}, {});

        expect(aTestComponent.headerVal).to.equal(expectedHeader);
    });

    it('should register component methods as routes', () => {

        class TestComponent {

            @GetMapping()
            getItems() {}
        }

        class AnotherTestComponent {
            
            @GetMapping({
                path: ':id/details'
            })
            anotherGetItems() {}
        }

        const addedRoutes: any[] = [];
        const expectedRoutes: any[] = [
            { 
                method: 'get', 
                path: 'items', 
                name: 'getItems'
            },
            { 
                method: 'get', 
                path: 'items/:id/details', 
                name: 'anotherGetItems'
            }
        ];

        // override the add route method
        compiler.addRoute = (method, path, aComponent, name) => {
            addedRoutes.push({
                method: method,
                path: path,
                name: name
            });
        };

        compiler.addExportedComponents('items', [
            TestComponent, AnotherTestComponent
        ]);

        expect(JSON.stringify(addedRoutes)).to.equal(JSON.stringify(expectedRoutes));
    });

    it('should return a list of class method names', () => {

        class TestClass {

            someMethod() {
                // ...
            }
        }

        // get a new instance of the test class
        const methods: string[] = compiler.getMethodList(
            TestClass
        );

        expect(methods[0]).to.equal('someMethod');
    });
  });