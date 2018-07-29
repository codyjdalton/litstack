/**
 * default-component.class.spec
 */
import { expect } from 'chai';

import { LitComponentTest, TestBed } from '../../testing';
import { DefaultComponent } from './default.component';

describe('DefaultComponent', () => {

    afterEach(() => {
        TestBed.stop();
    });

    it('should return a not implemented error', (done) => {

        const component: LitComponentTest = TestBed.start(DefaultComponent);

        component
            .get('/')
            .expect(501)
            .end((err) => {
                if (err) { return done(err); }
                done();
            });
    });
});
