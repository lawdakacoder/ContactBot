import { Texts } from "../utils/static";
import { sendMessage } from "../telegram/api";
import { banChat, getChatId, unbanChat } from "../utils/database";
import { isAdminReplyValid } from "../utils/logics";
import { OWNER_IDS } from "../config";

async function startCommand(message) {
    const { from: user, chat } = message;
    const response = Texts.startCommand
    .replace('{first_name}', user.first_name);
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Source Code', url: 'https://github.com/lawdakacoder/ContactBot' }]]
    };

    await sendMessage(chat.id, response, message.message_id, replyMarkup);
}

async function banCommand(message, args) {
    const { from: user, chat, reply_to_message } = message;

    if (!OWNER_IDS[0].includes(user.id)) return;

    if (isAdminReplyValid(reply_to_message, args)) {
        if (!reply_to_message?.forward_origin) return;

        const chatName = reply_to_message.forward_origin.sender_user_name ?? reply_to_message.forward_origin.sender_user.first_name;
        const chatId = await getChatId(reply_to_message.message_id);
        const response = Texts.chatBanned
        .replace('{chat_name}', chatName)
        .replace('{chat_id}', chatId);
        
        await banChat(chatId, args.join(' '));
        await sendMessage(chat.id, response, message.message_id);
    } else {
        await sendMessage(chat.id, Texts.banCommand, message.message_id);
    }
}

async function unbanCommand(message) {
    const { from: user, chat, reply_to_message } = message;

    if (!OWNER_IDS[0].includes(user.id)) return;

    if (reply_to_message?.forward_origin) {
        const chatName = reply_to_message.forward_origin.sender_user_name ?? reply_to_message.forward_origin.sender_user.first_name;
        const chatId = await getChatId(reply_to_message.message_id);
        const response = Texts.chatUnbanned
        .replace('{chat_name}', chatName)
        .replace('{chat_id}', chatId);
        
        await unbanChat(chatId);
        await sendMessage(chat.id, response, message.message_id);
    } else {
        await sendMessage(chat.id, Texts.unbanCommand, message.message_id);
    }
}

async function helpCommand(message) {
    const { chat } = message;
    await sendMessage(chat.id, Texts.helpCommand, message.message_id);
}

async function unknownCommand(message) {
    const { chat } = message;
    await sendMessage(chat.id, Texts.unknownCommand, message.message_id);
}

export async function handleCommand(message) {
    const { text } = message;
    const [command, ...args] = text.split(' ');

    switch (command) {
        case '/start':
            await startCommand(message, args);
            break;
        case '/ban':
            await banCommand(message, args);
            break;
        case '/unban':
            await unbanCommand(message);
            break;
        case '/help':
            await helpCommand(message);
            break;
        default:
            await unknownCommand(message);
    }
}
