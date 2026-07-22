/// <reference types="node" />
/**
 *
 */
import { Transform } from 'stream';
import { Options as ParseOpts } from 'csv-parse/sync';
import { Options as StringifyOpts } from 'csv-stringify';
/**
 * @private
 */
export declare function parseCSV(str: string, options?: ParseOpts): Object[];
/**
 * @private
 */
export declare function toCSV(records: Object[], options?: StringifyOpts): string;
/**
 * @private
 */
export declare function parseCSVStream(options?: ParseOpts): Transform;
/**
 * @private
 */
export declare function serializeCSVStream(options?: StringifyOpts): Transform;
