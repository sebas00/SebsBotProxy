"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consumer_1 = require("./consumer");
const exception_1 = require("./exception");
const path = require("./path");
class API {
    constructor(config) {
        const msg = "must not empty!!";
        if (!config.endpointUrl) {
            throw new exception_1.InvalidConfig("endpointUrl", msg);
        }
        if (!config.organizationId) {
            throw new exception_1.InvalidConfig("organizationId", msg);
        }
        if (!config.deploymentId) {
            throw new exception_1.InvalidConfig("deploymentId", msg);
        }
        if (!config.buttonId) {
            throw new exception_1.InvalidConfig("buttonId", msg);
        }
        if (!config.version) {
            throw new exception_1.InvalidConfig("version", msg);
        }
        this.config = config;
    }
    createSession() {
        const options = {
            uri: this.url(path.createSession),
            qs: {
                "SessionId.ClientType": "chasitor",
            },
            headers: {
                "X-LIVEAGENT-AFFINITY": "null",
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return this.execute(options);
    }
    deleteSession(sessionInfo) {
        const options = {
            uri: this.url(path.createSession) + "/" + sessionInfo.sessionKey,
            method: "DELETE",
            headers: {
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return this.execute(options);
    }
    chasitorInit(sessionInfo, sequence, payload) {
        const options = {
            uri: this.url(path.chasitorInit),
            method: "POST",
            headers: {
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    resyncSession(sessionInfo) {
        const options = {
            uri: this.url(path.resyncSession) + "/" + sessionInfo.sessionId,
            headers: {
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    resyncSessionState(sessionInfo, payload) {
        const options = {
            uri: this.url(path.resyncSessionState),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chasitorNotTyping(sessionInfo, sequence) {
        const options = {
            uri: this.url(path.chasitorNotTyping),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chasitorSneakPeek(sessionInfo, sequence, payload) {
        const options = {
            uri: this.url(path.chasitorSneakPeek),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chasitorTyping(sessionInfo, sequence) {
        const options = {
            uri: this.url(path.chasitorTyping),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chatEnd(sessionInfo, sequence) {
        const options = {
            uri: this.url(path.chatEnd),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: {
                reason: "client",
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chatCancel(sessionInfo, sequence) {
        const options = {
            uri: this.url(path.chatCancel),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: {},
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    chatMessage(sessionInfo, sequence, payload) {
        const options = {
            uri: this.url(path.chatMessage),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    customEvent(sessionInfo, sequence, payload) {
        const options = {
            uri: this.url(path.customEvent),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
                "X-LIVEAGENT-SEQUENCE": sequence || 0,
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    messages(sessionInfo, ackNum) {
        const options = {
            uri: this.url(path.messages),
            qs: {
                ack: ackNum,
            },
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version || sessionInfo.version,
                "X-LIVEAGENT-AFFINITY": sessionInfo.affinity || "null",
                "X-LIVEAGENT-SESSION-KEY": sessionInfo.sessionKey,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    settings() {
        const options = {
            uri: this.url(path.settings),
            qs: {
                "org_id": this.config.organizationId,
                "deployment_id": this.config.deploymentId,
                "Settings.buttonIds": this.config.buttonId,
            },
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    availability() {
        const options = {
            uri: this.url(path.availability),
            qs: {
                "org_id": this.config.organizationId,
                "deployment_id": this.config.deploymentId,
                "Availability.ids": this.config.buttonId,
            },
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    breadCrumb(payload) {
        const options = {
            uri: this.url(path.breadCrumb),
            method: "POST",
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            body: payload,
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    visitorId() {
        const options = {
            uri: this.url(path.visitorId),
            qs: {
                org_id: this.config.organizationId,
                deployment_id: this.config.deploymentId,
            },
            headers: {
                "X-LIVEAGENT-API-VERSION": this.config.version,
            },
            json: true,
            proxy: this.config.proxy,
        };
        return consumer_1.execute(options);
    }
    execute(opt) {
        return consumer_1.execute(opt);
    }
    url(cpath) {
        return this.config.endpointUrl + cpath;
    }
}
exports.default = API;
