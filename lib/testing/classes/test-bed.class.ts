/**
 * test-bed.class
 */
import express = require("express");
import request = require("supertest");

import { Injector } from "super-injector";
import { LitModule } from "../..";
import { ServiceCompiler } from "../../compiler";
import { ILitComponent } from "../../compiler/utils/compiler.utils";

export class MockServiceCompiler extends ServiceCompiler {

    /**
     * @function start
     * @description Start a component and return a supertest
     * @param component
     * @return {request.SuperTest<request.Test>}
     */
    public start(component: ILitComponent): request.SuperTest<request.Test> {

        this.reset();

        @LitModule({
            exports: [
                component
            ]
        })
        class TestModule {

        }

        this.bootstrap(TestModule);

        return request(this.app);
    }

    /**
     * @function stop
     * @description Stop the application
     * Usage:
     * TestBed.stop()
     */
    public stop(): void {
        if (this.server) {
            this.server.close();
        }
    }

    /**
     * @function reset
     * @description Reset the application
     */
    private reset(): void {
        this.app = express();

        this.stop();

        this.console = new class {
            public log() {
                // ..
            }
        };
    }
}

export const TestBed: MockServiceCompiler = Injector.resolve(MockServiceCompiler);
