
import {execute} from "./consumer";
import {InvalidConfig} from "./exception";
import * as path from "./path";

export default class API {
    public config: any;

    constructor(config: any) {
        const msg = "must not empty!!";
        if (!config.endpointUrl) {
            throw new InvalidConfig("endpointUrl", msg);
        }
        if (!config.organizationId) {
            throw new InvalidConfig("organizationId", msg);
        }
        if (!config.deploymentId) {
            throw new InvalidConfig("deploymentId", msg);
        }
        if (!config.buttonId) {
            throw new InvalidConfig("buttonId", msg);
        }
        if (!config.version) {
            throw new InvalidConfig("version", msg);
        }
        this.config = config;
    }

    public createSession(): Promise<any> {
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

    public deleteSession(sessionInfo: any): Promise<any> {
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

    public chasitorInit(sessionInfo: any, sequence: number, payload: any): Promise<any> {
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
        return execute(options);
    }

    public resyncSession(sessionInfo: any): Promise<any> {
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
        return execute(options);
    }

    public resyncSessionState(sessionInfo: any, payload: any): Promise<any> {
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
        return execute(options);
    }

    public chasitorNotTyping(sessionInfo: any, sequence: number): Promise<any> {
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
        return execute(options);
    }

    public chasitorSneakPeek(sessionInfo: any, sequence: number, payload: any): Promise<any> {
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
        return execute(options);
    }

    public chasitorTyping(sessionInfo: any, sequence: number): Promise<any> {
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
        return execute(options);
    }

    public chatEnd(sessionInfo: any, sequence: number): Promise<any> {
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
        return execute(options);
    }

    public chatCancel(sessionInfo: any, sequence: number): Promise<any> {
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
        return execute(options);
    }

    public chatMessage(sessionInfo: any, sequence: number, payload: any): Promise<any> {
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
        return execute(options);
    }

    public customEvent(sessionInfo: any, sequence: number, payload: any): Promise<any> {
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
        return execute(options);
    }

    public messages(sessionInfo: any, ackNum: number): Promise<any> {
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
        return execute(options);
    }

    public settings(): Promise<any> {
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
        return execute(options);
    }

    public availability(): Promise<any> {
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
        return execute(options);
    }

    public breadCrumb(payload: any): Promise<any> {
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
        return execute(options);
    }

    public visitorId(): Promise<any> {
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
        return execute(options);
    }

    private execute(opt: any): Promise<any> {
        return execute(opt);
    }

    private url(cpath: string): string {
        return this.config.endpointUrl + cpath;
    }
}
