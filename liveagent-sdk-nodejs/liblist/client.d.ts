import API from "./api";
export default class Client {
    id: string;
    sessionInfo: any;
    private clientInfo;
    private api;
    private isAbortedMsgLoop;
    private isChatEstablished;
    private ack;
    private sequence;
    private txtHandler;
    private stopHandler;
    constructor(config: any | API, clientInfo?: any);
    start: (txtHandler: (txt: string) => void) => void;
    stop: (stopHandler: () => void) => void;
    send: (msg: string) => boolean;
    private availabilityHandler;
    private sessionHandler;
    private chasitorInitHandler;
    private pollingLoop;
    private messageHandler;
    private exceptionHandler;
}
