/**
 * request.model
 */
import express = require('express');

/**
 * This type is to emulate the supported types
 * wrapping around an express request
 */
export interface HttpRequest extends express.Request {
    // ..
}