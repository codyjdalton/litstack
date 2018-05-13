/**
 * test-bed.class.spec
 */
import request = require('supertest');

import { expect } from 'chai';
import { Injector } from '../../compiler/classes/injector.class';
import { LitComponent } from '../..';
import { GetMapping, PutMapping } from '../../http/mappings';
import { TestBed } from '..';

describe('Class: TestBed', () => {

    afterEach(() => {
        TestBed.stop();
    });

    it('should allow testing a component', (done) => {

        @LitComponent()
        class SomeComponent {
            
            @GetMapping()
            getItems(req, res) {

                res.success({
                    message: 'test'
                });
            }

            @PutMapping({
                path: ':id',
                produces: 'application/vnd.item.v1'
            })
            updateItem(req, res) {
                res.success({
                    message: req.id
                });
            }
        }

        TestBed.start(SomeComponent)
               .get('/')
               .expect(200)
               .expect((res) => {
                    expect(res.body.message).to.equal('test');
               })
               .end((err, res) => {
                    if (err) return done(err);
                    done();
               });
    });
});