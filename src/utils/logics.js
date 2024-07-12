import { OWNER_IDS } from "../config";

export function isAdminReplyValid(replyMessage, args) {
    return replyMessage && !OWNER_IDS[0].includes(replyMessage.from.id) && args.length > 0;
}

export function isPositiveIntegerString(str) {
    const integerRegex = /^\d+$/;

    if (integerRegex.test(str)) {
        return parseInt(str, 10);
    }

    return null;
}