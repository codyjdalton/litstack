import { expect } from 'chai';

import { GetMapping } from '../../http/mappings';
import { Injector } from './injector.class';
import { LitComponent } from '../decorators/component.decorator';
import { LitService } from '../decorators/service.decorator';

describe('Class: Injector', () => {

    it('should instantiate an injector', () => {
        
        expect(Injector).to.not.be.undefined;
    });

    it('should get a new instance of a class', () => {

        class TestClass {

            someProp: string = 'test';

            constructor() {
            }
        }

        const aTestClass: TestClass = Injector.resolve(TestClass);

        expect(aTestClass.someProp).to.equal('test');
    });

    it('should get a new instance of a service with dependencies', () => {

        @LitService()
        class TestService {

            someProp = 'test-val';
        }

        @LitService()
        class AnotherService {

            constructor(private testDep: TestService) {
            }

            get theProp() {
                return this.testDep.someProp;
            }
        }

        const aTestClass: AnotherService = Injector.resolve(AnotherService);

        expect(aTestClass.theProp).to.equal('test-val');
    });

    it('should get a new instance of a component with dependencies', () => {

        @LitService()
        class TestService {

            someProp = 'test-val';
        }

        @LitComponent()
        class TestComponent {

            constructor(private testDep: TestService) {
            }

            get theProp() {
                return this.testDep.someProp;
            }
        }

        const aTestComponent: TestComponent = Injector.resolve(TestComponent);

        expect(aTestComponent.theProp).to.equal('test-val');
    });

    it('should allow setting metadata without a property key', () => {

        class TestClass {

        }

        Injector.set(TestClass, { someProp: 'test' });
    });

    it('should get all metadata for a method', () => {

        const expectedMetadata: any = {
            path: 'some-path',
            produces: 'some-test'
        };

        @LitComponent()
        class TestComponent {

            @GetMapping(expectedMetadata)
            someTest() {
                
            }
        }

        const aTestComponent: any = Injector.resolve(TestComponent);
        const metadata: any = Injector.getAll(aTestComponent, 'someTest');

        expect(metadata.path).to.equal(expectedMetadata.path);
        expect(metadata.produces).to.equal(expectedMetadata.produces);
    });

    it('should return a list of param types', () => {

        @LitComponent()
        class TestComponent {

            @GetMapping()
            resOnly(res) {
                
            }

            @GetMapping()
            reqRes(req, res) {

            }

            @GetMapping()
            reqResNext(req, res, next) {
                
            }
        }

        expect(Injector.getParams(TestComponent, 'noMethod').length).to.equal(0);
        expect(Injector.getParams(TestComponent, 'resOnly').length).to.equal(1);
        expect(Injector.getParams(TestComponent, 'reqRes').length).to.equal(2);
        expect(Injector.getParams(TestComponent, 'reqResNext').length).to.equal(3);
    });
  });