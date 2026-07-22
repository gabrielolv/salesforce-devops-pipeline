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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingExtension = exports.Streaming = exports.Subscription = exports.Client = void 0;
/**
 * @file Manages Streaming APIs
 * @author Shinichi Tomita <shinichi.tomita@gmail.com>
 */
const events_1 = require("events");
const faye_1 = require("faye");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return faye_1.Client; } });
Object.defineProperty(exports, "Subscription", { enumerable: true, get: function () { return faye_1.Subscription; } });
const jsforce_1 = require("../jsforce");
const StreamingExtension = __importStar(require("./streaming/extension"));
exports.StreamingExtension = StreamingExtension;
/*--------------------------------------------*/
/**
 * Streaming API topic class
 */
class Topic {
    _streaming;
    name;
    constructor(streaming, name) {
        this._streaming = streaming;
        this.name = name;
    }
    /**
     * Subscribe listener to topic
     */
    subscribe(listener) {
        return this._streaming.subscribe(this.name, listener);
    }
    /**
     * Unsubscribe listener from topic
     */
    unsubscribe(subscr) {
        this._streaming.unsubscribe(this.name, subscr);
        return this;
    }
}
/*--------------------------------------------*/
/**
 * Streaming API Generic Streaming Channel
 */
class Channel {
    _streaming;
    _id;
    name;
    constructor(streaming, name) {
        this._streaming = streaming;
        this.name = name;
    }
    /**
     * Subscribe to channel
     */
    subscribe(listener) {
        return this._streaming.subscribe(this.name, listener);
    }
    unsubscribe(subscr) {
        this._streaming.unsubscribe(this.name, subscr);
        return this;
    }
    async push(events) {
        const isArray = Array.isArray(events);
        const pushEvents = Array.isArray(events) ? events : [events];
        const conn = this._streaming._conn;
        if (!this._id) {
            this._id = conn
                .sobject('StreamingChannel')
                .findOne({ Name: this.name }, ['Id'])
                .then((rec) => rec?.Id);
        }
        const id = await this._id;
        if (!id) {
            throw new Error(`No streaming channel available for name: ${this.name}`);
        }
        const channelUrl = `/sobjects/StreamingChannel/${id}/push`;
        const rets = await conn.requestPost(channelUrl, {
            pushEvents,
        });
        return isArray ? rets : rets[0];
    }
}
/*--------------------------------------------*/
/**
 * Streaming API class
 */
class Streaming extends events_1.EventEmitter {
    _conn;
    _topics = {};
    _fayeClients = {};
    /**
     *
     */
    constructor(conn) {
        super();
        this._conn = conn;
    }
    /* @private */
    _createClient(forChannelName, extensions) {
        // forChannelName is advisory, for an API workaround. It does not restrict or select the channel.
        const needsReplayFix = typeof forChannelName === 'string' && forChannelName.startsWith('/u/');
        const endpointUrl = [
            this._conn.instanceUrl,
            // special endpoint "/cometd/replay/xx.x" is only available in 36.0.
            // See https://releasenotes.docs.salesforce.com/en-us/summer16/release-notes/rn_api_streaming_classic_replay.htm
            'cometd' +
                (needsReplayFix && this._conn.version === '36.0'
                    ? '/replay'
                    : ''),
            this._conn.version,
        ].join('/');
        const fayeClient = new faye_1.Client(endpointUrl, {});
        fayeClient.setHeader('Authorization', 'OAuth ' + this._conn.accessToken);
        if (Array.isArray(extensions)) {
            for (const extension of extensions) {
                fayeClient.addExtension(extension);
            }
        }
        // prevent streaming API server error
        const dispatcher = fayeClient._dispatcher;
        if (dispatcher.getConnectionTypes().indexOf('callback-polling') === -1) {
            dispatcher.selectTransport('long-polling');
            dispatcher._transport.batching = false;
        }
        return fayeClient;
    }
    /** @private **/
    _getFayeClient(channelName) {
        const isGeneric = channelName.startsWith('/u/');
        const clientType = isGeneric ? 'generic' : 'pushTopic';
        if (!this._fayeClients[clientType]) {
            this._fayeClients[clientType] = this._createClient(channelName);
        }
        return this._fayeClients[clientType];
    }
    /**
     * Get named topic
     */
    topic(name) {
        this._topics = this._topics || {};
        const topic = (this._topics[name] =
            this._topics[name] || new Topic(this, name));
        return topic;
    }
    /**
     * Get channel for channel name
     */
    channel(name) {
        return new Channel(this, name);
    }
    /**
     * Subscribe topic/channel
     */
    subscribe(name, listener) {
        const channelName = name.startsWith('/') ? name : '/topic/' + name;
        const fayeClient = this._getFayeClient(channelName);
        return fayeClient.subscribe(channelName, listener);
    }
    /**
     * Unsubscribe topic
     */
    unsubscribe(name, subscription) {
        const channelName = name.startsWith('/') ? name : '/topic/' + name;
        const fayeClient = this._getFayeClient(channelName);
        fayeClient.unsubscribe(channelName, subscription);
        return this;
    }
    /**
     * Create a Streaming client, optionally with extensions
     *
     * See Faye docs for implementation details: https://faye.jcoglan.com/browser/extensions.html
     *
     * Example usage:
     *
     * ```javascript
     * const jsforce = require('jsforce');
     *
     * // Establish a Salesforce connection. (Details elided)
     * const conn = new jsforce.Connection({ … });
     *
     * const fayeClient = conn.streaming.createClient();
     *
     * const subscription = fayeClient.subscribe(channel, data => {
     *   console.log('topic received data', data);
     * });
     *
     * subscription.cancel();
     * ```
     *
     * Example with extensions, using Replay & Auth Failure extensions in a server-side Node.js app:
     *
     * ```javascript
     * const jsforce = require('jsforce');
     * const { StreamingExtension } = require('jsforce/api/streaming');
     *
     * // Establish a Salesforce connection. (Details elided)
     * const conn = new jsforce.Connection({ … });
     *
     * const channel = "/event/My_Event__e";
     * const replayId = -2; // -2 is all retained events
     *
     * const exitCallback = () => process.exit(1);
     * const authFailureExt = new StreamingExtension.AuthFailure(exitCallback);
     *
     * const replayExt = new StreamingExtension.Replay(channel, replayId);
     *
     * const fayeClient = conn.streaming.createClient([
     *   authFailureExt,
     *   replayExt
     * ]);
     *
     * const subscription = fayeClient.subscribe(channel, data => {
     *   console.log('topic received data', data);
     * });
     *
     * subscription.cancel();
     * ```
     */
    createClient(extensions) {
        return this._createClient(null, extensions);
    }
}
exports.Streaming = Streaming;
/*--------------------------------------------*/
/*
 * Register hook in connection instantiation for dynamically adding this API module features
 */
(0, jsforce_1.registerModule)('streaming', (conn) => new Streaming(conn));
exports.default = Streaming;
