/**
 * test-bed.class
 */
import express = require('express');
import request = require('supertest');

import { ServiceCompiler } from '../../compiler';
import { Injector } from "../../compiler/classes/injector.class";
import { ILitComponent } from '../../compiler/utils/compiler.utils';
import { LitModule } from '../..';

export class MockServiceCompiler extends ServiceCompiler {

    /**
     * @function start
     * @description Start a component and return a supertest
     * @param component 
     * @return {request.SuperTest<request.Test>}
     */
    start(component: ILitComponent): request.SuperTest<request.Test> {

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
    stop(): void {
        if(this.server) {
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
            log() {}
        };
    }
}

export const TestBed: MockServiceCompiler = Injector.resolve(MockServiceCompiler);