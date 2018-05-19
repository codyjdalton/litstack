import { expect } from "chai";

import { LitModule } from "../..";
import { Injector } from "../classes/injector.class";

describe("Class: Injector", () => {

    it("should allow passing exports to modules", () => {

        @LitModule({
            exports: []
        })
        class TestModule {

        }

        expect(Injector.get(TestModule, "exports")).to.not.be.undefined;
    });

    it("should allow empty module arguments", () => {
        @LitModule()
        class TestModule {

        }

        expect(Injector.get(TestModule, "path").toString()).to.equal("");
        expect(Injector.get(TestModule, "exports").toString()).to.equal([].toString());
        expect(Injector.get(TestModule, "imports").toString()).to.equal([].toString());
    });
});
