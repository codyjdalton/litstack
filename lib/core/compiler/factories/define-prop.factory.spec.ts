import { expect } from 'chai';
import 'mocha';
import { definePropFactory } from './define-prop.factory';


describe('Class: Injector', () => {

    it('should only define a prop if it there is a value', () => {
       
       function testFunc() {
          // ..
       }

       definePropFactory(testFunc.prototype, 'test', undefined);
       definePropFactory(testFunc.prototype, 'another-test', 'another-test');

       expect(new testFunc()['test']).to.be.undefined;
       expect(new testFunc()['another-test']).to.not.be.undefined;
    });
});