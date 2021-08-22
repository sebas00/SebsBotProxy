export declare class ClientError extends Error {
    constructor(msg: string);
}
export declare class InvalidConfig extends ClientError {
    confName: string;
    constructor(confName: string, msg: string);
}
export declare class RequestError extends Error {
    code: number;
    constructor(code: number, msg: string);
}
