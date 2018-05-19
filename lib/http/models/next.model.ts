/**
 * next.model
 */
import express = require("express");

/**
 * This type is to emulate the supported types
 * wrapping around an express next method
 */
export type HttpNext = express.NextFunction;
