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
     * @function success
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
 }