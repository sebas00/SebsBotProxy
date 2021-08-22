export class ClientError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

export class InvalidConfig extends ClientError {
    public confName: string;

    constructor(confName: string, msg: string) {
        super(msg);
        this.confName = confName;
    }
}

export class RequestError extends Error {
    public code: number;

    constructor(code: number, msg: string) {
        super(msg);
        this.code = code;
    }
}
