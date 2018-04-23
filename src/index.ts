import { Express } from "express";
import * as expInst from "express";

// TEST //
import { SeedModule } from './modules/seed/seed.module';

let aSeed = new SeedModule();
// @TODO bootstrap all this...
// TEST //

class Service {
    constructor(private app: Express = expInst()) {
        this.onInit();
    }

    /**
     * @function onInit
     * Initialize the application
     */
    private onInit(): void {
        this.app.listen(8000, () => console.log("Server running on 8000!"));
    }
}

const aService = new Service();