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
     * @param {object} obj
     * 
     * Usage:
     * res.success({ id: 'some-id' })
     * 
     * Would respond with 200 OK
     * { id: 'some-id' }
     */ 
    success(obj: Object): void {
        this.rawRes.status(200).json(obj);
    }

    /**
     * @function success
     * @param {object} obj
     * 
     * Usage:
     * res.success({ id: 'some-id' })
     * 
     * Would respond with 201 Created
     * { id: 'some-id' }
     */ 
    created(obj: Object): void {
        this.rawRes.status(201).json(obj);
    }
 }