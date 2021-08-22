import * as uuid from "uuid";
export function generateId(): string {
    return uuid.v1();
}
