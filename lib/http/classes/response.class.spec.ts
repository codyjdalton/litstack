import { expect } from 'chai';

import { HttpResponse } from './response.class';
import { TestBed, LitComponentTest } from '../../testing';
import { LitComponent } from '../..';
import { GetMapping } from '../mappings';
import { HttpRequest } from '..';

describe('Class: HttpResponse', () => {

    let component: LitComponentTest;

    afterEach(() => {

        TestBed.stop();
    });

    it('should default success to 200', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            customSuccess(req, res: HttpResponse) {
                res.success({});
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return 201 for a created response', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            customError(req, res: HttpResponse) {
                res.created([]);
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should default errors to 500', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            customSuccess(req, res: HttpResponse) {
                res.errored();
            }
        }

        component = TestBed.start(TestComponent);
        component
            .get('/')
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should allow setting custom error code and message', (done) => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            customSuccess(req: HttpRequest, res: HttpResponse) {
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
                if (err) return done(err);
                done();
            });
    });
});