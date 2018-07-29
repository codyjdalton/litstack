/**
 * test-bed.class
 */
import express = require('express');
import request = require('supertest');

import { Injector } from 'super-injector';
import { LitModule } from '../..';
import { ServiceCompiler } from '../../compiler';
import { ILitComponent, ILitModule } from '../../compiler/utils/compiler.utils';

export class MockServiceCompiler extends ServiceCompiler {

    /**
     * @function start
     * @description Start a component and return a supertest
     * @param component
     * @return {request.SuperTest<request.Test>}
     */
    public start(component: ILitComponent): request.SuperTest<request.Test> {

        @LitModule({
            exports: [
                component
            ]
        })
        class TestModule {

        }

        return this.startModule(TestModule);
    }

    /**
     * @method startModule
     * @param TestModule
     */
    public startModule(TestModule: ILitModule, port: number | null = null): request.SuperTest<request.Test> {

        this.reset();

        this.bootstrap(TestModule, port || undefined);

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

        this.console = {
            log: (txt: string) => this.logged.push(txt)
        };
    }
}

export const TestBed: MockServiceCompiler = Injector.resolve(MockServiceCompiler);
