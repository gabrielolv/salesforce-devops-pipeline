import { HttpBody } from '../types';
export declare function getBodySize(body: HttpBody | undefined, headers?: {
    [name: string]: string;
}): number | undefined;
