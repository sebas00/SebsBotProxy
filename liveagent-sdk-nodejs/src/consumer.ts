import * as rp from "request-promise-native";
import * as errors from "request-promise-native/errors";
import {ClientError, RequestError} from "./exception";

export function execute(opt: any) {
    return rp(opt).catch((err) => {
        if (err instanceof errors.StatusCodeError) {
            throw new RequestError(err.statusCode, err.message);
        } else {
            throw new ClientError(err.message);
        }
    });
}
