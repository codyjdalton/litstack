/**
 * This type is to emulate the supported types
 * wrapping around an express response
 */
export interface Response {
    json: Function;
    status: Function;
}