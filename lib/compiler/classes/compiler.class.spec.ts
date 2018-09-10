/**
 * compiler.class.spec
 */
import { expect } from 'chai';

import { LitComponent, LitModule, LitService } from '../..';
import { HttpNext, HttpRequest, HttpResponse } from '../../http';
import { DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping } from '../../http/mappings';
import { LitComponentTest, TestBed } from '../../testing';

describe('Class: Compiler', () => {

    afterEach(() => {
        TestBed.stop();
    });

    it('should log the application port to the console', (done) => {

        @LitModule()
        class TestModule {
        }

        const testPort: number = 8080;
        const expectedGreeting: string = 'Application running on port ' + testPort;

        TestBed.startModule(TestModule, testPort)
            .get('/')
            .end(() => {
                expect(TestBed.logged[0]).to.equal(expectedGreeting);
                done();
            });
    });

    it('should add module imports', (done) => {

        @LitComponent()
        class TestComponent {

            @PostMapping({
                path: 'items'
            })
            public getItems(res) {
                // ..
                res.success();
            }
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

        const aModule: LitComponentTest = TestBed.startModule(TestAppModule);

        aModule.post('/some/items')
            .send({})
            .expect(200)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should allow non-routed methods', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public someTest(req, res) {
                this.onSuccess(res);
            }

            /**
             * No decorator
             */
            private onSuccess(res) {
                res.success();
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should walk the entire import tree', (done) => {

        @LitComponent()
        class GrandChildComponent {

            @PutMapping({
                path: ':grandchild_id'
            })
            public getGrand(req, res) {
                res.success();
            }
        }

        @LitComponent()
        class ChildComponent {

            @DeleteMapping()
            public getChild(req, res) {
                res.success();
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
            public getTest(req, res) {
                res.success();
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

        const aModule: LitComponentTest = TestBed.startModule(TestModule);

        aModule.put('/parents/children/grandchildren/:grandchild_id')
            .send({})
            .expect(200)
            .end((err, res) => {
                if (err) { return done(err); }

                aModule.delete('/parents')
                    .expect(200)
                    .end((err2) => {
                        if (err2) { return done(err2); }

                        aModule.post('/')
                            .send({})
                            .expect(200)
                            .end((err3) => {
                                if (err3) { return done(err3); }
                                done();
                            });
                    });
            });
    });

    it('should respond to http requests', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ':id',
                produces: 'application/vnd.messages.v1+json'
            })
            public getItem(req, res: HttpResponse) {
                res.success({
                    message: req.params.id
                });
            }
        }

        const contentType: string = 'application/vnd.messages.v1+json; charset=utf-8';

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/123')
            .expect(200)
            .expect('Content-Type', contentType)
            .expect((res) => {
                expect(res.body.message).to.equal('123');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should inject res if the handler has a single param', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public getItems(res: HttpResponse): void {
                res.success({ message: 'succeeded' });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('succeeded');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should inject req and res if the handler has two params', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ':id'
            })
            public getItems(req: HttpRequest, res: HttpResponse): void {
                res.success({ message: req.params.id });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/another-test')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('another-test');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should inject req, res, and next if the handler has three params', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ':id'
            })
            public getItems(req: HttpRequest, res: HttpResponse, next: HttpNext): void {

                if (req.params.id === 'test') {
                    res.success({ message: req.params.id });
                    return;
                }

                next();
            }

            @GetMapping({
                path: ':id'
            })
            public getItemsErr(res: HttpResponse): void {
                res.errored(404, { message: 'error' });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/yet-another-test')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).to.equal('error');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should only handle the next route if next is called', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ':id'
            })
            public getItems(req: HttpRequest, res: HttpResponse, next: HttpNext): void {

                if (req.params.id === 'test') {
                    res.success({ message: req.params.id });
                    return;
                }

                next();
            }

            @GetMapping({
                path: ':id'
            })
            public getItemsErr(res: HttpResponse): void {
                res.errored(404, { message: 'error' });
            }
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/test')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('test');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should return 404 if no params are defined', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping({
                path: ':id'
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
            .get('/test')
            .expect(501)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should inject dependencies', (done) => {

        @LitService()
        class TestService {
            public message: string = 'test-val';
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
            .get('/')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('test-val');
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should allow extending a default component', (done) => {

        class DefaultComponent {

            @GetMapping()
            public findAbstract(res: HttpResponse) {
                res.success({});
            }
        }

        @LitComponent()
        class TestComponent extends DefaultComponent {
            // ..
        }

        const component: LitComponentTest = TestBed.start(TestComponent);

        component
            .get('/')
            .expect(200)
            .expect((res) => {
                expect(res.body).deep.equal({});
            })
            .end((err) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should allow using middlewares', (done) => {

        let testValue: string = '';

        @LitComponent()
        class PreMiddleware {

            @RequestMapping()
            public test(req, res, next) {
                testValue = 'newValue';
                next();
            }
        }

        @LitComponent()
        class SomeComponent {

            @GetMapping({
                path: ':id'
            })
            public getOne(req, res) {
                res.success({
                    message: testValue
                });
            }
        }

        @LitModule({
            exports: [
                PreMiddleware,
                SomeComponent
            ]
        })
        class TestModule {}

        const aModule: LitComponentTest = TestBed.startModule(TestModule);

        aModule.get('/some-val')
            .expect(200)
            .expect((res) => {
                expect(res.body).deep.equal({ message: 'newValue' });
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });
});
