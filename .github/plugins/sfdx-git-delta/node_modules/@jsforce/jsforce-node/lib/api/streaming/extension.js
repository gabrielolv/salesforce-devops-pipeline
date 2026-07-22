"use strict";
/**
 * Faye Client extensions: https://faye.jcoglan.com/browser/extensions.html
 *
 * For use with Streaming.prototype.createClient()
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Replay = exports.AuthFailure = void 0;
/*-------------------------------------------*/
/**
 * Constructor for an auth failure detector extension
 *
 * Based on new feature released with Salesforce Spring '18:
 * https://releasenotes.docs.salesforce.com/en-us/spring18/release-notes/rn_messaging_cometd_auth_validation.htm?edition=&impact=
 *
 * Example triggering error message:
 *
 * ```
 * {
 *   "ext":{
 *     "sfdc":{"failureReason":"401::Authentication invalid"},
 *     "replay":true},
 *   "advice":{"reconnect":"none"},
 *   "channel":"/meta/handshake",
 *   "error":"403::Handshake denied",
 *   "successful":false
 * }
 * ```
 *
 * Example usage:
 *
 * ```javascript
 * const jsforce = require('jsforce');
 * const { StreamingExtension } = require('jsforce/api/streaming');
 *
 * const conn = new jsforce.Connection({ … });
 *
 * const channel = "/event/My_Event__e";
 *
 * // Exit the Node process when auth fails
 * const exitCallback = () => process.exit(1);
 * const authFailureExt = new StreamingExtension.AuthFailure(exitCallback);
 *
 * const fayeClient = conn.streaming.createClient([ authFailureExt ]);
 *
 * const subscription = fayeClient.subscribe(channel, data => {
 *   console.log('topic received data', data);
 * });
 *
 * subscription.cancel();
 * ```
 *
 * @param {Function} failureCallback - Invoked when authentication becomes invalid
 */
class AuthFailure {
    _failureCallback;
    constructor(failureCallback) {
        this._failureCallback = failureCallback;
    }
    incoming(message, callback) {
        if ((message.channel === '/meta/connect' ||
            message.channel === '/meta/handshake') &&
            message.advice &&
            message.advice.reconnect == 'none') {
            this._failureCallback(message);
        }
        else {
            callback(message);
        }
    }
}
exports.AuthFailure = AuthFailure;
/*-------------------------------------------*/
const REPLAY_FROM_KEY = 'replay';
/**
 * Constructor for a durable streaming replay extension
 *
 * Modified from original Salesforce demo source code:
 * https://github.com/developerforce/SalesforceDurableStreamingDemo/blob/3d4a56eac956f744ad6c22e6a8141b6feb57abb9/staticresources/cometdReplayExtension.resource
 *
 * Example usage:
 *
 * ```javascript
 * const jsforce = require('jsforce');
 * const { StreamingExtension } = require('jsforce/api/streaming');
 
 * const conn = new jsforce.Connection({ … });
 *
 * const channel = "/event/My_Event__e";
 * const replayId = -2; // -2 is all retained events
 *
 * const replayExt = new StreamingExtension.Replay(channel, replayId);
 *
 * const fayeClient = conn.streaming.createClient([ replayExt ]);
 *
 * const subscription = fayeClient.subscribe(channel, data => {
 *   console.log('topic received data', data);
 * });
 *
 * subscription.cancel();
 * ```
 */
class Replay {
    _extensionEnabled;
    _replay;
    _channel;
    constructor(channel, replayId) {
        this._extensionEnabled = replayId != null;
        this._channel = channel;
        this._replay = replayId;
    }
    setExtensionEnabled(extensionEnabled) {
        this._extensionEnabled = extensionEnabled;
    }
    setReplay(replay) {
        this._replay = parseInt(replay, 10);
    }
    setChannel(channel) {
        this._channel = channel;
    }
    incoming(message, callback) {
        if (message.channel === '/meta/handshake') {
            if (message.ext && message.ext[REPLAY_FROM_KEY] == true) {
                this._extensionEnabled = true;
            }
        }
        else if (message.channel === this._channel &&
            message.data?.event?.replayId) {
            this._replay = message.data.event.replayId;
        }
        callback(message);
    }
    outgoing(message, callback) {
        if (message.channel === '/meta/subscribe') {
            if (this._extensionEnabled) {
                if (!message.ext) {
                    message.ext = {};
                }
                const replayFromMap = {
                    [this._channel]: this._replay,
                };
                // add "ext : { "replay" : { CHANNEL : REPLAY_VALUE }}" to subscribe message
                message.ext[REPLAY_FROM_KEY] = replayFromMap;
            }
        }
        callback(message);
    }
}
exports.Replay = Replay;
