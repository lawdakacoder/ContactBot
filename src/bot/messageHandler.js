import { banStatus, saveChatId } from "../utils/database";
import { Texts } from "../utils/static";
import { sendMessage, forwardMessage } from "../telegram/api";
import { handleCommand } from "./commandHandler";
import { OWNER_IDS } from "../config";
import { handleReply } from "./replyHandler";

async function sendToOwner(chatId, messageId) {
    const response = await forwardMessage(OWNER_IDS[1], chatId, messageId);
    await saveChatId(response.result.message_id, chatId);
}

export async function handleMessage(message) {
    const { chat, text, forward_origin } = message;
    const owner = OWNER_IDS[1]===chat.id;

    if (forward_origin) {
        return;
    }

    if (text?.startsWith('/')) {
        return await handleCommand(message);
    }

    if (!owner) {

        if (chat.type !== 'private') {
            return;
        }

        const { isBanned, banReason } = await banStatus(chat.id);
        if (isBanned) {
            const reason = Texts.chatIsBanned.replace('{reason}', banReason);
            await sendMessage(chat.id, reason, message.message_id);
            return;
        }
    }

    if (owner) {
        await handleReply(message);
    } else {
        await sendToOwner(chat.id, message.message_id);
    }
}
