import { expect } from 'chai';
import 'mocha';

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
  });