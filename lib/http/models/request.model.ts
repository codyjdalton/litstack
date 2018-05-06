/**
 * This type is to emulate the supported types
 * wrapping around an express request
 */
export interface HttpRequest {
    params: any;
    query: any;
}