/**
 * response.class
 * 
 * The HTTP response class is a wrapper for the
 * http response object.s
 */
import { Response } from '../models/response.model';

 export class HttpResponse {

    constructor(private rawRes: Response) {
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
    success(obj: any): void {
        this.rawRes.status(200).json(obj);
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
    created(obj: any): void {
        this.rawRes.status(201).json(obj);
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
    errored(status: number = 500, messageObj: any = null): void {
        this.rawRes.status(status).json(messageObj || { message: "An error occurred" });
    }
 }