"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRegistry = void 0;
const connection_1 = __importDefault(require("../connection"));
/**
 *
 */
class BaseRegistry {
    _registryConfig = {};
    _saveConfig() {
        throw new Error('_saveConfig must be implemented in subclass');
    }
    _getClients() {
        return this._registryConfig.clients || (this._registryConfig.clients = {});
    }
    _getConnections() {
        return (this._registryConfig.connections ||
            (this._registryConfig.connections = {}));
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async getConnectionNames() {
        return Object.keys(this._getConnections());
    }
    async getConnection(name) {
        const config = await this.getConnectionConfig(name);
        return config ? new connection_1.default(config) : null;
    }
    async getConnectionConfig(name) {
        if (!name) {
            name = this._registryConfig['default'];
        }
        const connections = this._getConnections();
        const connConfig = name ? connections[name] : undefined;
        if (!connConfig) {
            return null;
        }
        const { client, ...connConfig_ } = connConfig;
        if (client) {
            return {
                ...connConfig_,
                oauth2: { ...(await this.getClientConfig(client)) },
            };
        }
        return connConfig_;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async saveConnectionConfig(name, connConfig) {
        const connections = this._getConnections();
        const { oauth2, ...connConfig_ } = connConfig;
        let persistConnConfig = connConfig_;
        if (oauth2) {
            const clientName = this._findClientName(oauth2);
            if (clientName) {
                persistConnConfig = { ...persistConnConfig, client: clientName };
            }
            delete connConfig.oauth2;
        }
        connections[name] = persistConnConfig;
        this._saveConfig();
    }
    _findClientName({ clientId, loginUrl }) {
        const clients = this._getClients();
        for (const name of Object.keys(clients)) {
            const client = clients[name];
            if (client.clientId === clientId &&
                (client.loginUrl || 'https://login.salesforce.com') === loginUrl) {
                return name;
            }
        }
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async setDefaultConnection(name) {
        this._registryConfig['default'] = name;
        this._saveConfig();
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async removeConnectionConfig(name) {
        const connections = this._getConnections();
        delete connections[name];
        this._saveConfig();
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async getClientConfig(name) {
        const clients = this._getClients();
        const clientConfig = clients[name];
        return clientConfig && { ...clientConfig };
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async getClientNames() {
        return Object.keys(this._getClients());
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async registerClientConfig(name, clientConfig) {
        const clients = this._getClients();
        clients[name] = clientConfig;
        this._saveConfig();
    }
}
exports.BaseRegistry = BaseRegistry;
