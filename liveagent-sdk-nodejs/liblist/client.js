"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const api_1 = require("./api");
const exception_1 = require("./exception");
const util_1 = require("./util");
class Client {
    constructor(config, clientInfo) {
        this.start = (txtHandler) => {
            logger.info("connecting...");
            this.txtHandler = txtHandler;
            // - check avalability.
            this.api.availability()
                .then(this.availabilityHandler)
                .then(this.sessionHandler)
                .then(this.chasitorInitHandler)
                .catch(this.exceptionHandler);
        };
        this.stop = (stopHandler) => {
            this.hasSession = false;
            this.stopHandler = stopHandler;
            this.isAbortedMsgLoop = true;
        };
        this.send = (msg) => {
            if (this.isChatEstablished) {
                this.api.chatMessage(this.sessionInfo, ++this.sequence, { text: msg })
                    .catch((err) => {
                    logger.error("send message failed. ", err);
                    throw err;
                });
            }
            return this.isChatEstablished;
        };
        this.availabilityHandler = (res) => {
            const isOnline = res.messages[0].message.results[0].isAvailable || false;
            if (!isOnline) {
                logger.info("the agent is offline.");
                throw new exception_1.ClientError("the agent is offline.");
            }
            logger.info("the agent is online.");
            return this.api.createSession();
        };
        this.sessionHandler = (sessionId) => {
            // - check parameters.
            if (!sessionId) {
                logger.info("establish a connection failed.");
                throw new exception_1.ClientError("establish a connection failed.");
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
            const payload = {
                organizationId: this.api.config.organizationId,
                deploymentId: this.api.config.deploymentId,
                buttonId: this.api.config.buttonId,
                sessionId: this.sessionInfo.sessionId,
                userAgent: this.clientInfo.name,
                language: this.clientInfo.language,
                screenResolution: this.clientInfo.screenResolution,
                visitorName: this.clientInfo.visitorName,
                prechatDetails: this.clientInfo.prechatDetails,
                prechatEntities: [],
                buttonOverrides: [],
                receiveQueueUpdates: false,
                isPost: true,
            };
            // - call initial
            return this.api.chasitorInit(this.sessionInfo, ++this.sequence, payload);
        };
        this.chasitorInitHandler = (res) => {
            const isSuccess = res && res === "OK";
            if (!isSuccess) {
                logger.info("create a visitor chat session failed.");
                throw new exception_1.ClientError("create a visitor chat session failed.");
            }
            logger.info("create a visitor chat session successfully.");
            this.send(this.startmessage);
            this.hasSession = true;
            // - call polling loop
            this.pollingLoop();
        };
        this.pollingLoop = () => {
            this.api.messages(this.sessionInfo, this.ack)
                .then((msg) => {
                this.messageHandler(msg);
                console.log(this.lastContact - Date.now());
                if((this.lastContact - Date.now()) / 1000 < -1000){
                    this.hasSession = false;
                    this.api.chatEnd(this.sessionInfo, ++this.sequence);
                    this.isAbortedMsgLoop = true;
                    return;
                }
                if (!this.isAbortedMsgLoop) {
                    this.pollingLoop();
                }
                else {
                    // - FIXME: cancel message request first.
                    let endPromise;
                    if (this.isChatEstablished) {
                        endPromise = this.api.chatEnd(this.sessionInfo, ++this.sequence);
                    }
                    else {
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
                    logger.error(err);
                logger.error("get messages failed, ack = %d", this.ack);
            });
        };
        this.messageHandler = (res) => {
            logger.info("res", res);
            if (res) {
                this.ack = res.sequence;
                this.msgtxt = "";
                res.messages.forEach((msg) => {
                    //logger.info("ms", msg);
                    switch (msg.type) {
                        case "ChatEstablished": {
                            this.isChatEstablished = true;
                            break;
                        }
                        case "ChatMessage": {
                            this.lastContact = Date.now();
                            logger.info("chat");
                            this.msgtxt = this.msgtxt + msg.message.text + "\n";
                            console.log('mestext', this.msgtxt);
                            //this.txtHandler(msg.message.text);
                            break;
                        }
                        case "RichMessage": {
                            logger.info("richt");
                            var moption = 1;
                            var options = []
                            var mt = '';
                            msg.message.items.forEach((mitems) => {
                             mt = mt + 'option ' + moption + ', ' + mitems.text
                                options.push({id : moption, text : mitems.text})
                             //this.msgtxt = this.msgtxt + moption + ' ' + mitems.text + "\n";
                             console.log('mestext', this.msgtxt);
                             moption++;
                            })
                            this.msgtxt = this.msgtxt + mt + "\n";
                            //this.msgtxt = JSON.stringify(options)
                            //this.txtHandler(msg.message.type);
                            break;
                        }
                        case "ChatEnded": {
                            this.isAbortedMsgLoop = true;
                            this.hasSession = false;
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
                            
                            logger.info("b unhandle message type: %s", msg.type);
                            logger.info("msg", msg);
                            console.log(msg);
                            break;
                        }
                    }
                    
                });
                console.log('we still here');
                if(this.msgtxt != ""){
                this.txtHandler(this.msgtxt);
                }
            }
        };
        this.exceptionHandler = (err) => {
            logger.error("an error occured.", err);
            throw err;
        };
        if (config instanceof api_1.default) {
            this.api = config;
        }
        else {
            this.api = new api_1.default(config);
        }
        this.id = util_1.generateId();
        logger.info("create a client with id = [%s]", this.id);
        this.clientInfo = {
            name: clientInfo.name || this.id,
            language: clientInfo.language || "en_US",
            screenResolution: clientInfo.screenResolution || "0x0",
            visitorName: clientInfo.visitorName || "nodejs-client",
            prechatDetails: clientInfo.prechatDetails || []
        };
        this.ack = -1;
        this.sequence = 0;
        this.isAbortedMsgLoop = false;
        this.isChatEstablished = false;
        this.hasSession = false;
    }
}
exports.default = Client;
