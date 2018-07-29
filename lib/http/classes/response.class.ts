/**
 * response.class
 *
 * The HTTP response class is a wrapper for the
 * http response object
 */
import defaultResponse = require('default-response');
import express = require('express');

// @TODO MOVE THESE TO THEIR OWN FILE!!!!
export interface MetaConfig {
    produces?: string;
}

export type Body = object | any[] | null;

export class HttpResponse {

    constructor(public response: express.Response,
                private meta: MetaConfig) {
    }

    public setProduces(): void {
        if (this.meta.produces) {
            this.setHeaders('Content-Type', this.meta.produces);
        }
    }

    public setHeaders(key: string, val: string): void {
        this.response.set(key, val);
    }

    /**
     * @function success
     * @param {Body} body
     *
     * Usage:
     * res.success({ id: 'some-id' })
     *
     * Would respond with 200 OK
     * { id: 'some-id' }
     */
    public success(body: Body, status: number = 200): void {

        this.respond(status, body);
    }

    /**
     * @function created
     * @param {Body} body
     *
     * Usage:
     * res.created({ id: 'some-id' })
     *
     * Would respond with 201 Created
     * { id: 'some-id' }
     */
    public created(body: Body): void {
        this.success(body, 201);
    }

    /**
     * @function errored
     * @param {number} status
     * @param {Object | any[]} body
     *
     * Usage:
     * res.errored(404, { message: 'The resource was not found on this server' })
     *
     * Would respond with 404 Created
     * { message: 'The resource was not found on this server' }
     */
    public errored(status: number = 500, body: Body = null): void {

        this.respond(status, body);
    }

    private respond(status: number, body: object | any[] | null): void {

        // set the produces header if one exists
        this.setProduces();

        this.response.status(status).json(body || defaultResponse.status(status));
    }
}
