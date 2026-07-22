"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaults = void 0;
const request_helper_1 = require("../request-helper");
const stream_1 = require("../util/stream");
/**
 * As the request streming is not yet supported on major browsers,
 * it is set to false for now.
 */
const supportsReadableStream = false;
/*
(async () => {
  try {
    if (
      typeof fetch === 'function' &&
      typeof Request === 'function' &&
      typeof ReadableStream === 'function'
    ) {
      // this feature detection requires dummy POST request
      const req = new Request('data:text/plain,', {
        method: 'POST',
        body: new ReadableStream(),
      });
      // if it has content-type header it doesn't regard body as stream
      if (req.headers.has('Content-Type')) {
        return false;
      }
      await (await fetch(req)).text();
      return true;
    }
  } catch (e) {
    // error might occur in env with CSP without connect-src data:
    return false;
  }
  return false;
})();
*/
/**
 *
 */
function toWhatwgReadableStream(ins) {
    return new ReadableStream({
        start(controller) {
            ins.on('data', (chunk) => controller.enqueue(chunk));
            ins.on('end', () => controller.close());
        },
    });
}
/**
 *
 */
async function readWhatwgReadableStream(rs, outs) {
    const reader = rs.getReader();
    async function readAndWrite() {
        const { done, value } = await reader.read();
        if (done) {
            outs.end();
            return false;
        }
        outs.write(value);
        return true;
    }
    while (await readAndWrite())
        ;
}
/**
 *
 */
async function startFetchRequest(request, options, input, output, emitter, counter = 0) {
    const { followRedirect } = options;
    const { url, body: reqBody, ...rreq } = request;
    const body = input && /^(post|put|patch)$/i.test(request.method)
        ? supportsReadableStream
            ? toWhatwgReadableStream(input)
            : await (0, stream_1.readAll)(input)
        : undefined;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
    const res = await (0, request_helper_1.executeWithTimeout)(() => fetch(url, {
        ...rreq,
        ...(body ? { body } : {}),
        redirect: 'manual',
        ...(controller ? { signal: controller.signal } : {}),
        ...{ allowHTTP1ForStreamingUpload: true }, // Chrome allows request stream only in HTTP2/QUIC unless this opt-in flag
    }), options.timeout, () => controller?.abort());
    const headers = {};
    // @ts-expect-error no .keys()?
    for (const headerName of res.headers.keys()) {
        headers[headerName.toLowerCase()] = res.headers.get(headerName);
    }
    const response = {
        statusCode: res.status,
        headers,
    };
    if (followRedirect && (0, request_helper_1.isRedirect)(response.statusCode)) {
        try {
            (0, request_helper_1.performRedirectRequest)(request, response, followRedirect, counter, (req) => startFetchRequest(req, options, undefined, output, emitter, counter + 1));
        }
        catch (err) {
            emitter.emit('error', err);
        }
        return;
    }
    emitter.emit('response', response);
    if (res.body) {
        readWhatwgReadableStream(res.body, output);
    }
    else {
        output.end();
    }
}
/**
 *
 */
function getResponseHeaderNames(xhr) {
    const headerLines = (xhr.getAllResponseHeaders() || '')
        .split(/[\r\n]+/)
        .filter((l) => l.trim() !== '');
    return headerLines.map((headerLine) => headerLine.split(/\s*:/)[0].toLowerCase());
}
/**
 *
 */
async function startXmlHttpRequest(request, options, input, output, emitter, counter = 0) {
    const { method, url, headers: reqHeaders } = request;
    const { followRedirect } = options;
    const reqBody = input && /^(post|put|patch)$/i.test(method) ? await (0, stream_1.readAll)(input) : null;
    const xhr = new XMLHttpRequest();
    await (0, request_helper_1.executeWithTimeout)(() => {
        xhr.open(method, url);
        if (reqHeaders) {
            for (const header in reqHeaders) {
                xhr.setRequestHeader(header, reqHeaders[header]);
            }
        }
        if (options.timeout) {
            xhr.timeout = options.timeout;
        }
        xhr.responseType = 'arraybuffer';
        xhr.send(reqBody);
        return new Promise((resolve, reject) => {
            xhr.onload = () => resolve();
            xhr.onerror = reject;
            xhr.ontimeout = reject;
            xhr.onabort = reject;
        });
    }, options.timeout, () => xhr.abort());
    const headerNames = getResponseHeaderNames(xhr);
    const headers = headerNames.reduce((headers, headerName) => ({
        ...headers,
        [headerName]: xhr.getResponseHeader(headerName) || '',
    }), {});
    const response = {
        statusCode: xhr.status,
        headers: headers,
    };
    if (followRedirect && (0, request_helper_1.isRedirect)(response.statusCode)) {
        try {
            (0, request_helper_1.performRedirectRequest)(request, response, followRedirect, counter, (req) => startXmlHttpRequest(req, options, undefined, output, emitter, counter + 1));
        }
        catch (err) {
            emitter.emit('error', err);
        }
        return;
    }
    let body;
    if (!response.statusCode) {
        response.statusCode = 400;
        body = Buffer.from('Access Declined');
    }
    else {
        body = Buffer.from(xhr.response);
    }
    emitter.emit('response', response);
    output.write(body);
    output.end();
}
/**
 *
 */
let defaults = {};
/**
 *
 */
function setDefaults(defaults_) {
    defaults = defaults_;
}
exports.setDefaults = setDefaults;
/**
 *
 */
function request(req, options_ = {}) {
    const options = { ...defaults, ...options_ };
    const { input, output, stream } = (0, request_helper_1.createHttpRequestHandlerStreams)(req, options);
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        startFetchRequest(req, options, input, output, stream);
    }
    else {
        startXmlHttpRequest(req, options, input, output, stream);
    }
    return stream;
}
exports.default = request;
