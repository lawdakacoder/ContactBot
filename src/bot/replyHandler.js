import { copyMessage } from "../telegram/api";
import { getChatId } from "../utils/database";

export async function handleReply(message) {
    const { chat, reply_to_message } = message;

    if (reply_to_message?.forward_origin) {
        const messageSender = await getChatId(reply_to_message.message_id);
        await copyMessage(
            messageSender,
            chat.id,
            message.message_id
        );
    }
}