"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpProxyTransport = exports.XdProxyTransport = exports.CanvasTransport = exports.JsonpTransport = exports.Transport = void 0;
const request_1 = __importStar(require("./request"));
const promise_1 = require("./util/promise");
const jsonp_1 = __importDefault(require("./browser/jsonp"));
const canvas_1 = __importDefault(require("./browser/canvas"));
/**
 * Normarize Salesforce API host name
 * @private
 */
function normalizeApiHost(apiHost) {
    const m = /(\w+)\.(visual\.force|salesforce)\.com$/.exec(apiHost);
    if (m) {
        return `${m[1]}.salesforce.com`;
    }
    return apiHost;
}
(0, request_1.setDefaults)({
    httpProxy: process.env.https_proxy ?? process.env.http_proxy ?? process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY ?? undefined,
    timeout: process.env.HTTP_TIMEOUT
        ? parseInt(process.env.HTTP_TIMEOUT, 10)
        : undefined,
    followRedirect: true,
});
const baseUrl = typeof window !== 'undefined' && window.location && window.location.host
    ? `https://${normalizeApiHost(window.location.host)}`
    : process.env.LOCATION_BASE_URL || '';
/**
 * Class for HTTP request transport
 *
 * @class
 * @protected
 */
class Transport {
    /**
     */
    httpRequest(req, options = {}) {
        return promise_1.StreamPromise.create(() => {
            const createStream = this.getRequestStreamCreator();
            const stream = createStream(req, options);
            const promise = new Promise((resolve, reject) => {
                stream
                    .on('complete', (res) => resolve(res))
                    .on('error', reject);
            });
            return { stream, promise };
        });
    }
    /**
     * @protected
     */
    getRequestStreamCreator() {
        return request_1.default;
    }
}
exports.Transport = Transport;
/**
 * Class for JSONP request transport
 */
class JsonpTransport extends Transport {
    static supprted = jsonp_1.default.supported;
    _jsonpParam;
    constructor(jsonpParam) {
        super();
        this._jsonpParam = jsonpParam;
    }
    getRequestStreamCreator() {
        const jsonpRequest = jsonp_1.default.createRequest(this._jsonpParam);
        return (params) => jsonpRequest(params);
    }
}
exports.JsonpTransport = JsonpTransport;
/**
 * Class for Sfdc Canvas request transport
 */
class CanvasTransport extends Transport {
    static supported = canvas_1.default.supported;
    _signedRequest;
    constructor(signedRequest) {
        super();
        this._signedRequest = signedRequest;
    }
    getRequestStreamCreator() {
        const canvasRequest = canvas_1.default.createRequest(this._signedRequest);
        return (params) => canvasRequest(params);
    }
}
exports.CanvasTransport = CanvasTransport;
/* @private */
function createXdProxyRequest(req, proxyUrl) {
    const headers = {
        'salesforceproxy-endpoint': req.url,
    };
    if (req.headers) {
        for (const name of Object.keys(req.headers)) {
            headers[name] = req.headers[name];
        }
    }
    const nocache = `${Date.now()}.${String(Math.random()).substring(2)}`;
    return {
        method: req.method,
        url: `${proxyUrl}?${nocache}`,
        headers,
        ...(req.body != null ? { body: req.body } : {}),
    };
}
/**
 * Class for HTTP request transport using cross-domain AJAX proxy service
 */
class XdProxyTransport extends Transport {
    _xdProxyUrl;
    constructor(xdProxyUrl) {
        super();
        this._xdProxyUrl = xdProxyUrl;
    }
    /**
     * Make HTTP request via AJAX proxy
     */
    httpRequest(req, _options = {}) {
        const xdProxyUrl = this._xdProxyUrl;
        const { url, body, ...rreq } = req;
        const canonicalUrl = url.startsWith('/') ? baseUrl + url : url;
        const xdProxyReq = createXdProxyRequest({ ...rreq, url: canonicalUrl, body }, xdProxyUrl);
        return super.httpRequest(xdProxyReq, {
            followRedirect: (redirectUrl) => createXdProxyRequest({ ...rreq, method: 'GET', url: redirectUrl }, xdProxyUrl),
        });
    }
}
exports.XdProxyTransport = XdProxyTransport;
/**
 * Class for HTTP request transport using a proxy server
 */
class HttpProxyTransport extends Transport {
    _httpProxy;
    constructor(httpProxy) {
        super();
        this._httpProxy = httpProxy;
    }
    /**
     * Make HTTP request via proxy server
     */
    httpRequest(req, options_ = {}) {
        const options = { ...options_, httpProxy: this._httpProxy };
        return super.httpRequest(req, options);
    }
}
exports.HttpProxyTransport = HttpProxyTransport;
exports.default = Transport;
