/**
 * compiler.class.spec
 */
import express = require("express");
import request = require("supertest");

import { expect } from "chai";
import { merge, Observable, of, Subscription } from "rxjs";
import { delay, mapTo } from "rxjs/operators";

import { Injector } from "super-injector";

import { LitComponent, LitModule, LitService } from "../..";
import { HttpNext, HttpRequest, HttpResponse } from "../../http";
import { DeleteMapping, GetMapping, PatchMapping, PostMapping, PutMapping } from "../../http/mappings";
import { LitComponentTest, TestBed } from "../../testing";
import { LitCompiler, ServiceCompiler } from "./compiler.class";

describe("Class: Compiler", () => {

    let compiler: ServiceCompilerStub;

    class ServiceCompilerStub extends ServiceCompiler {

        public port: string | number = "";
        public meta: string = "";

        // we don't want to actually log anything
        // to the console in our spec
        // so we will mock this.console
        public console = new class {
            public logged: string[] = [];
            public log(text: string): void {
                // ..
                this.logged.push(text);
            }
        };

        get exchange() {
            return request(this.app);
        }

        public getPort() {
            return this.server.address().port;
        }

        public setMeta(text: string) {
            this.meta = text;
        }

        public closeServer() {
            if (this.server) {
                this.server.close();
            }
        }

        public findRoutesByPath(path) {

            path = "/" + path;
            return this.app._router.stack.filter(
                (item) => item.route &&
                          item.route.path === path
            ).map(
                (item) => {
                    return item.route;
                }
            );
        }

        public getRoutePaths(): string[] {
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

    it("should allow setting a custom port", () => {

        @LitModule()
        class TestModule {

        }

        const testPort = 8080;

        compiler.bootstrap(TestModule, testPort);

        expect(compiler.getPort()).to.equal(testPort);
    });

    it("should start the application with a greeting", (done) => {

        @LitModule()
        class TestModule {

        }

        const testPort: number = 8080;
        const expectedGreeting: string = "Application running on port " + testPort;

        compiler.bootstrap(TestModule, testPort);

        const res = of(null);
        const emitter: Subscription = merge(
            res.pipe(mapTo(
                null
            ), delay(10))
        ).subscribe(
            (res2) =>  {
                expect(compiler.console.logged[0]).to.equal(expectedGreeting);
                emitter.unsubscribe();
                done();
            }
        );
    });

    it("should add component exports", () => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: "items"
            })
            public getItems(req, res) {
                compiler.setMeta("test-input");
            }
        }

        @LitModule({
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        compiler.bootstrap(TestModule);

        const routes = compiler.findRoutesByPath("items");

        // a route should be found
        expect(routes.length).to.equal(1);

        // it should be a get request
        expect(routes[0].methods.get).to.be.true;

        // call the handler
        routes[0].stack[0].handle({}, {});

        expect(compiler.meta).to.equal("test-input");
    });

    it("should add module imports", () => {

        @LitComponent()
        class TestComponent {

            @PostMapping({
                path: "items"
            })
            public getItems(req, res) {
                // ..
            }
        }

        @LitModule({
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        @LitModule({
            path: "some",
            imports: [
                TestModule
            ]
        })
        class TestAppModule {}

        compiler.bootstrap(TestAppModule);

        const routes = compiler.findRoutesByPath("some/items");

        // a route should be found
        expect(routes.length).to.equal(1);

        // it should be a get request
        expect(routes[0].methods.post).to.be.true;
    });

    it("should only register routes with mapping decorators", () => {

        @LitComponent()
        class TestComponent {

            public someUtil() {
                // ..
            }
        }

        @LitModule({
            path: "items",
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        compiler.bootstrap(TestModule);

        const routes = compiler.findRoutesByPath("items");

        expect(routes.length).to.equal(0);
    });

    it("should walk the entire import tree", () => {

        @LitComponent()
        class GrandChildComponent {

            @PutMapping({
                path: ":grandchild_id"
            })
            public getGrand(req, res) {
                // ..
            }
        }

        @LitComponent()
        class ChildComponent {

            @DeleteMapping()
            public getChild(req, res) {
                // ..
            }
        }

        @LitModule({
            path: "grandchildren",
            exports: [
                GrandChildComponent
            ]
        })
        class GrandChildModule {
        }

        @LitModule({
            path: "children",
            imports: [
                GrandChildModule
            ]
        })
        class ChildModule {
        }

        @LitModule({
            path: "parents",
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
            public getTest(req, res) {
                // ..
            }
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
            "/",
            "/parents",
            "/parents/children/grandchildren/:grandchild_id"
        ];

        compiler.bootstrap(TestModule);

        expect(
            JSON.stringify(compiler.getRoutePaths())
        )
        .to.equal(
            JSON.stringify(expectedRoutes)
        );
    });

    it("should respond to http requests", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ":id",
                produces: "application/vnd.messages.v1+json"
            })
            public getItem(req, res: HttpResponse) {
                res.success({
                    message: req.params.id
                });
            }
        }

        @LitModule({
            path: "items",
            exports: [
                TestComponent
            ]
        })
        class TestModule {}

        const contentType: string = "application/vnd.messages.v1+json; charset=utf-8";

        compiler.bootstrap(TestModule);

        compiler.exchange
                .get("/items/123")
                .expect("Content-Type", contentType)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).to.equal("123");
                })
                .end((err, res) => {
                    if (err) { return done(err); }
                    done();
                });
    });

    it("should inject res if the handler has a single param", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public getItems(res: HttpResponse): void {
                res.success({ message: "succeeded" });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/")
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal("succeeded");
            })
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });

    it("should inject req and res if the handler has two params", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ":id"
            })
            public getItems(req: HttpRequest, res: HttpResponse): void {
                res.success({ message: req.params.id });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/another-test")
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal("another-test");
            })
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });

    it("should inject req, res, and next if the handler has three params", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ":id"
            })
            public getItems(req: HttpRequest, res: HttpResponse, next: HttpNext): void {

                if (req.params.id === "test") {
                    res.success({ message: req.params.id });
                    return;
                }

                next();
            }

            @GetMapping({
                path: ":id"
            })
            public getItemsErr(res: HttpResponse): void {
                res.errored(404, { message: "error" });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/yet-another-test")
            .expect(404)
            .expect((res) => {
                expect(res.body.message).to.equal("error");
            })
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });

    it("should only handle the next route if next is called", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ":id"
            })
            public getItems(req: HttpRequest, res: HttpResponse, next: HttpNext): void {

                if (req.params.id === "test") {
                    res.success({ message: req.params.id });
                    return;
                }

                next();
            }

            @GetMapping({
                path: ":id"
            })
            public getItemsErr(res: HttpResponse): void {
                res.errored(404, { message: "error" });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/test")
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal("test");
            })
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });

    it("should return 404 if no params are defined", (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ":id"
            })
            public getItems(): void {

                // I'm not really sure what they are doing here
                // but hey, someone will do it
                // we want to fail if this method is called
                // and instead send them to the default component
                // which will throw a 501 err
                expect(true).to.be.false;
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/test")
            .expect(501)
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });

    it("should inject dependencies", (done) => {

        @LitService()
        class TestService {
            public message: string = "test-val";
        }

        @LitComponent()
        class TestComponent {

            constructor(private testService: TestService) {
            }

            @GetMapping()
            public getItems(res: HttpResponse) {
                res.success({
                    message: this.testService.message
                });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get("/")
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal("test-val");
            })
            .end((err, res) => {
                TestBed.stop();
                if (err) { return done(err); }
                done();
            });
    });
});
