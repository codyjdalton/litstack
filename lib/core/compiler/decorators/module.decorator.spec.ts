import { expect } from 'chai';
import 'mocha';

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

        // check for exports
        const aModule: TestModule = Injector.resolve(TestModule);

        expect(aModule['exports']).to.not.be.undefined;
    });

    it('should allow empty module arguments', () => {
        @LitModule()
        class TestModule {

        }

        // check for exports
        const aModule: TestModule = Injector.resolve(TestModule);

        expect(aModule['path'].toString()).to.equal('');
        expect(aModule['exports'].toString()).to.equal([].toString());
        expect(aModule['imports'].toString()).to.equal([].toString());
    });
});