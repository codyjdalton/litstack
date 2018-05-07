/**
 * response.class
 * 
 * The HTTP response class is a wrapper for the
 * http response object.s
 */
import { Response } from '../models/response.model';
import { Injector } from '../../compiler/classes/injector.class';

 export class HttpResponse {

    constructor(public rawRes: any,
                public meta: any = {}) { 
    }

    setProduces(): void {
        if(this.meta.produces) {
            this.setHeaders('Content-Type', this.meta.produces)
        }
    }

    setHeaders(key: string, val: string): void {
        this.rawRes.set(key, val);
    }

    /**
     * @function success
     * @param {any} obj
     * 
     * Usage:
     * res.success({ id: 'some-id' })
     * 
     * Would respond with 200 OK
     * { id: 'some-id' }
     */ 
    success(obj: Object | any[], status: number = 200): void {

        // set the produces header if one exists 
        this.setProduces();

        this.rawRes.status(status).json(obj);
    }

    /**
     * @function created
     * @param {any} obj
     * 
     * Usage:
     * res.created({ id: 'some-id' })
     * 
     * Would respond with 201 Created
     * { id: 'some-id' }
     */ 
    created(obj: Object | any[]): void {
        this.success(obj, 201);
    }

    /**
     * @function errored
     * @param {any} obj
     * 
     * Usage:
     * res.errored(404, { message: 'The resource was not found on this server' })
     * 
     * Would respond with 404 Created
     * { message: 'The resource was not found on this server' }
     */ 
    errored(status: number | null = null, messageObj: Object = {}): void {
        this.rawRes.status(status || 500).json(messageObj);
    }
 }