import * as logger from "winston";
import API from "./api";
import {ClientError} from "./exception";
import {generateId} from "./util";

export default class Client {
    public id: string;
    public sessionInfo: any;
    public res:any;
    private clientInfo: any;
    private api: API;

    private isAbortedMsgLoop: boolean;
    private isChatEstablished: boolean;
    private ack: number;
    private sequence: number;
    private txtHandler: (txt: string, res: any) => void;
    private stopHandler: () => void;

    constructor(config: any | API, clientInfo?: any) {
        if (config instanceof API) {
            this.api = config;
        } else {
            this.api = new API(config);
        }
        this.id = generateId();
        logger.info("create a client with id = [%s]", this.id);
        this.clientInfo = {
            name: clientInfo.name || this.id,
            language: clientInfo.language || "en_US",
            screenResolution: clientInfo.screenResolution || "0x0",
            visitorName: clientInfo.visitorName || "nodejs-client",
        };
        this.ack = -1;
        this.sequence = 0;
        this.isAbortedMsgLoop = false;
        this.isChatEstablished = false;
    }

    public start = (txtHandler: (txt: string, res: any) => void): void => {
        logger.info("connecting...");
        this.txtHandler = txtHandler;
        // - check avalability.
        this.api.availability()
        .then(this.availabilityHandler)
        .then(this.sessionHandler)
        .then(this.chasitorInitHandler)
        .catch(this.exceptionHandler);
    }

    public stop = (stopHandler: () => void): void => {
        this.stopHandler = stopHandler;
        this.isAbortedMsgLoop = true;
    }

    public send = (msg: string): boolean => {
        if (this.isChatEstablished) {
            this.api.chatMessage(this.sessionInfo, ++this.sequence, {text: msg})
            .catch((err) => {
                logger.error("send message failed. ", err);
                throw err;
            });
        }
        return this.isChatEstablished;
    }

    private availabilityHandler = (res: any): Promise<any> => {
        const isOnline = res.messages[0].message.results[0].isAvailable || false;
        if (!isOnline) {
            logger.info("the agent is offline.");
            throw new ClientError("the agent is offline.");
        }
        logger.info("the agent is online.");
        return this.api.createSession();
    }
    private sessionHandler = (sessionId: any): Promise<any> => {
        // - check parameters.
        if (!sessionId) {
            logger.info("establish a connection failed.");
            throw new ClientError("establish a connection failed.");
        }
        logger.info("establish a connection successfully.");
        // - assign the session info of this client.
        this.sessionInfo = {
            affinity: sessionId.affinityToken,
            sessionKey: sessionId.key,
            sessionId: sessionId.id,
            timeout: sessionId.clientPollTimeout,
        };
        // - the initial payload request.
        const payload: any = {
            organizationId: this.api.config.organizationId,
            deploymentId: this.api.config.deploymentId,
            buttonId: this.api.config.buttonId,
            sessionId: this.sessionInfo.sessionId,
            userAgent: this.clientInfo.name,
            language: this.clientInfo.language,
            screenResolution: this.clientInfo.screenResolution,
            visitorName: this.clientInfo.visitorName,
            prechatDetails: [],
            prechatEntities: [],
            buttonOverrides: [],
            receiveQueueUpdates: false,
            isPost: true,
        };
        // - call initial
        return this.api.chasitorInit(this.sessionInfo, ++this.sequence, payload);
    }

    private chasitorInitHandler = (res: any): void => {
        const isSuccess = res && res === "OK";
        if (!isSuccess) {
            logger.info("create a visitor chat session failed.");
            throw new ClientError("create a visitor chat session failed.");
        }
        logger.info("create a visitor chat session successfully.");
        // - call polling loop
        this.pollingLoop();
    }

    private pollingLoop = (): void => {
        this.api.messages(this.sessionInfo, this.ack)
        .then((msg) => {
            this.messageHandler(msg);
            if (!this.isAbortedMsgLoop) {
                this.pollingLoop();
            } else {
                // - FIXME: cancel message request first.
                let endPromise: Promise<any>;
                if (this.isChatEstablished) {
                    endPromise = this.api.chatEnd(this.sessionInfo, ++this.sequence);
                } else {
                    endPromise = this.api.chatCancel(this.sessionInfo, ++this.sequence);
                }
                if (endPromise) {
                    endPromise.then((res) => {
                        this.api.deleteSession(this.sessionInfo).then(this.stopHandler);
                    });
                }
            }
        })
        .catch((err) => {
            logger.error("get messages failed, ack = %d", this.ack);
        });
    }

    private messageHandler = (res: any): void => {
        if (res) {
            res.messages.forEach((msg: any) => {
                console.log(msg);
                switch (msg.type) {
                    case "ChatEstablished": {
                        this.isChatEstablished = true;
                        break;
                    }
                    case "ChatMessage": {
                        this.txtHandler(msg.message.text, this.res);
                        break;
                    }
                    case "RichMessage": {
                        //this.txtHandler(msg.message.type, this.res);
                        break;
                    }
                    case "ChatEnded": {
                        this.isAbortedMsgLoop = true;
                        break;
                    }
                    // - TODO: Handle more case
                    case "AgentDisconnect": {
                        break;
                    }
                    case "AgentNotTyping": {
                        break;
                    }
                    case "AgentTyping": {
                        break;
                    }
                    case "ChasitorSessionData": {
                        break;
                    }
                    case "ChatRequestFail": {
                        break;
                    }
                    case "ChatRequestSuccess": {
                        break;
                    }
                    case "ChatTransferred": {
                        break;
                    }
                    case "CustomEvent": {
                        break;
                    }
                    case "NewVisitorBreadcrumb": {
                        break;
                    }
                    case "QueueUpdate": {
                        break;
                    }
                    default: {
                        logger.info("unhandle message type: %s", msg.type);
                        break;
                    }
                }
            });
            this.ack = res.sequence;
        }
    }

    private exceptionHandler = (err: Error) => {
        logger.error("an error occured.", err);
        throw err;
    }
}
