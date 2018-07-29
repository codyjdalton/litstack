import { expect } from 'chai';

import { HttpRequest } from '..';
import { LitComponent } from '../..';
import { LitComponentTest, TestBed } from '../../testing';
import { GetMapping, RequestMapping } from '../mappings';
import { HttpResponse } from './response.class';

describe('Class: HttpResponse', () => {

    let component: LitComponentTest;

    afterEach(() => {

        TestBed.stop();
    });

    it('should default success to 200', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public customSuccess(req, res: HttpResponse) {
                res.success({});
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should return 201 for a created response', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public customError(req, res: HttpResponse) {
                res.created([]);
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(201)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should default errors to 500', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public customSuccess(req, res: HttpResponse) {
                res.errored();
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(500)
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should allow setting custom error code and message', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            public customSuccess(req: HttpRequest, res: HttpResponse) {
                res.errored(401, {});
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(401)
            .expect((res: HttpRequest) => {
                expect(res.body.toString()).to.equal({}.toString());
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should support a custom mapping', (done) => {

        @LitComponent()
        class TestComponent {

            @RequestMapping({
                method: 'post',
                path: 'someurl'
            })
            public customSuccess(req: HttpRequest, res: HttpResponse) {
                res.success({
                    success: true
                }, 200);
            }
        }

        component = TestBed.start(TestComponent);
        component
            .post('/someurl')
            .expect(200)
            .expect((res: HttpRequest) => {
                expect(res.body.toString()).to.equal({ success: true }.toString());
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });
});
