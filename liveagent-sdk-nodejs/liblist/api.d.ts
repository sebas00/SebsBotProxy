export default class API {
    config: any;
    constructor(config: any);
    createSession(): Promise<any>;
    deleteSession(sessionInfo: any): Promise<any>;
    chasitorInit(sessionInfo: any, sequence: number, payload: any): Promise<any>;
    resyncSession(sessionInfo: any): Promise<any>;
    resyncSessionState(sessionInfo: any, payload: any): Promise<any>;
    chasitorNotTyping(sessionInfo: any, sequence: number): Promise<any>;
    chasitorSneakPeek(sessionInfo: any, sequence: number, payload: any): Promise<any>;
    chasitorTyping(sessionInfo: any, sequence: number): Promise<any>;
    chatEnd(sessionInfo: any, sequence: number): Promise<any>;
    chatCancel(sessionInfo: any, sequence: number): Promise<any>;
    chatMessage(sessionInfo: any, sequence: number, payload: any): Promise<any>;
    customEvent(sessionInfo: any, sequence: number, payload: any): Promise<any>;
    messages(sessionInfo: any, ackNum: number): Promise<any>;
    settings(): Promise<any>;
    availability(): Promise<any>;
    breadCrumb(payload: any): Promise<any>;
    visitorId(): Promise<any>;
    private execute;
    private url;
}
