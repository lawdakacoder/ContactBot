/**
Save chat id with message id
**/
export async function saveChatId(messageId, chatId) {
    await msgs.put(messageId, chatId.toString());
}

/**
Fetch chat id using message id
**/
export async function getChatId(messageId) {
    const fetchedData = await msgs.get(messageId);
    return Number(fetchedData);
}

/**
Ban the given chat.
**/
export async function banChat(chatId, reason) {
    const chatJson = {isBanned:true, banReason:reason};
    await users.put(chatId, JSON.stringify(chatJson));
}

/**
Unban the given chat.
**/
export async function unbanChat(chatId) {
    await users.delete(chatId);
}

/**
Check if chat is banned.
**/
export async function banStatus(chatId) {
    let chatJson = {isBanned: false, banReason: ''};
    const fetchedData = await users.get(chatId);

    if (fetchedData) {
        chatJson = JSON.parse(fetchedData);
    }

    return chatJson;
}