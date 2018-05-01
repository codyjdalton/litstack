import * as express from 'express';
import { expect } from 'chai';
import 'mocha';

import { ServiceCompiler } from './compiler.class';
import { Injector } from './injector.class';

describe('Class: Compiler', () => {

    class TestComponent {

        // @Mapping() is not needed here as the
        // compiler already has this metadata
        query(req, res) {}
    }

    let compiler: ServiceCompiler;

    beforeEach(() => {
        
        compiler = new ServiceCompiler();
    }); 

    it('should add component routes to the app', () => {

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
                    new TestComponent(),
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

    it('should return whether a method exists on a class', () => {

        class TestClass {

            someMethod() {
                // ...
            }
        }

        // get a new instance of the test class
        const aTestClass: TestClass = new TestClass();

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
        const aTestClass: TestClass = new TestClass();
        const methods: string[] = compiler.getInstanceMethodNames(
            aTestClass
        );

        expect(methods[0]).to.equal('someMethod');
    });
  });