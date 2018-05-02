import * as express from 'express';
import { expect } from 'chai';
import 'mocha';

import { definePropFactory } from '../factories/define-prop.factory';
import { GetMapping } from '../../http/mappings';
import { Injector } from './injector.class';
import { LitModule } from '../..';
import { ServiceCompiler } from './compiler.class';

describe('Class: Compiler', () => {

    let compiler: ServiceCompiler;

    beforeEach(() => {
        
        compiler = Injector.resolve(ServiceCompiler);
    });

    it('should instantiate a new app on construct', () => {
        expect(compiler.app).is.not.undefined;
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
        compiler.addExports = (aModule) => {};

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
        compiler.addExports = (aModule) => {};

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
        compiler.addExports = (aModule) => {};


        compiler.bootstrap(TestModule, port);

        expect(succeeded).to.be.true;
    });

    it('should add imported routes from the parent module', () => {
        
        class TestModule {}

        let succeeded: boolean = false;

        // override the addImportedRoutes method
        compiler.addExports = (aModule) => {
            if(aModule instanceof TestModule) {
                succeeded = true;
            }
        };

        // override the app listen method
        compiler.app.listen = (a, b): any => { return;};

        compiler.bootstrap(TestModule);

        expect(succeeded).to.be.true;
    });

    it('should add module exports and dependencies', () => {

        class ItemsComponent {
            val = 'test';
        }

        class DetailsComponent {
            val = 'another-test';
        }

        @LitModule({
            path: 'details',
            exports: [
                DetailsComponent
            ]
        })
        class DetailsModule {}

        @LitModule({
            path: 'items',
            exports: [
                ItemsComponent
            ],
            imports: [
                DetailsModule
            ]
        })
        class ItemsModule {}

        const addedExports = [];
        const expectedExports = [
            {
              path: "items",
              includes: [
                "test"
              ]
            },
            {
              path: "details",
              includes: [
                "another-test"
              ]
            }
        ];

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

        compiler.addExports(Injector.resolve(ItemsModule));

        expect(
            JSON.stringify(addedExports)
        ).to.equal(
            JSON.stringify(expectedExports)
        );
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

                compiler.addRoute(
                    method,
                    path,
                    Injector.resolve(TestComponent),
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

    it('should return whether a method exists on a class', () => {

        class TestClass {

            someMethod() {
                // ...
            }
        }

        // get a new instance of the test class
        const aTestClass: TestClass = Injector.resolve(TestClass);

        // it shouldn't have 'someOtherMethod' (false positive)
        expect(compiler.hasMethod(
            Object.getPrototypeOf(aTestClass),
            'someOtherMethod'
        )).to.equal(false);

        // it should have 'someMethod'
        expect(compiler.hasMethod(
            Object.getPrototypeOf(aTestClass),
            'someMethod'
        )).to.equal(true);
    });

    it('should return a list of class method names', () => {

        class TestClass {

            someMethod() {
                // ...
            }
        }

        // get a new instance of the test class
        const aTestClass: TestClass = Injector.resolve(TestClass);
        const methods: string[] = compiler.getInstanceMethodNames(
            aTestClass
        );

        expect(methods[0]).to.equal('someMethod');
    });
  });