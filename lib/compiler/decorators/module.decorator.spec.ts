import { expect } from 'chai';

import { Injector } from '../classes/injector.class';
import { LitModule } from '../..';

describe('Class: Injector', () => {

    it('should allow passing exports to modules', () => {
        @LitModule({
            exports: [
                'test'
            ]
        })
        class TestModule {

        }

        expect(Injector.get(TestModule, 'exports')).to.not.be.undefined;
    });

    it('should allow empty module arguments', () => {
        @LitModule()
        class TestModule {

        }

        expect(Injector.get(TestModule, 'path').toString()).to.equal('');
        expect(Injector.get(TestModule, 'exports').toString()).to.equal([].toString());
        expect(Injector.get(TestModule, 'imports').toString()).to.equal([].toString());
    });
});