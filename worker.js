// This file is auto generated and directly
// deployable to cloudflare workers from
// user dashboard.

(() => {
    // src/config.js
    var API_ROOT = "https://api.telegram.org";
    var SECRET_TOKEN = "";
    var BOT_TOKEN = "";
    var OWNER_IDS = [
      // User ids that can ban/unban users
      [
        1111111111,
        2222222222
      ],
      // Chat id where bot will send messages
      // can be group id or same as user id as
      // above. All group members can reply.
      3333333333
    ];
  
    // src/utils/database.js
    async function saveChatId(messageId, chatId) {
      await msgs.put(messageId, chatId.toString());
    }
    async function getChatId(messageId) {
      const fetchedData = await msgs.get(messageId);
      return Number(fetchedData);
    }
    async function banChat(chatId, reason) {
      const chatJson = { isBanned: true, banReason: reason };
      await users.put(chatId, JSON.stringify(chatJson));
    }
    async function unbanChat(chatId) {
      await users.delete(chatId);
    }
    async function banStatus(chatId) {
      let chatJson = { isBanned: false, banReason: "" };
      const fetchedData = await users.get(chatId);
      if (fetchedData) {
        chatJson = JSON.parse(fetchedData);
      }
      return chatJson;
    }
  
    // src/utils/static.js
    var Texts = {
      startCommand: `
  Hi there, <b>{first_name}</b>! You can contact my owner using me.
  
  You can send one or more messages, and I will <b><i>silently</i></b> forward them to my owner. Don't worry! I will also deliver my owner's response to you. Your identity is <b>never</b> revealed to anyone.
      `,
      helpCommand: `
  <b>Available Commands:</b>
  <code>/start</code> - Ping the bot.
  <code>/ban</code> - Ban the user. <b>(Admin only!)</b>
  <code>/unban</code> - Unban the user. <b>(Admin only!)</b>
  <code>/help</code> - Get help text.
      `,
      banCommand: "Send <code>/ban</code> with reason as reply to an user message to ban the user.",
      unbanCommand: "Send <code>/unban</code> as reply to an user message to unban the user.",
      unknownCommand: "Unknown command! Send <code>/help</code> to get list of available commands.",
      chatBanned: "Banned <b>{chat_name}</b> (<code>{chat_id}</code>).",
      chatIsBanned: "<b>Sorry, you are banned from using this bot!</b>\n\n<b>Reason:</b>\n{reason}",
      chatUnbanned: "Unbanned <b>{chat_name}</b> (<code>{chat_id}</code>).",
      notValidArgument: "The provided argument is invalid."
    };
  
    // src/telegram/api.js
    async function sendRequest(method, payload, isFormData = false) {
      const url = `${API_ROOT}/bot${BOT_TOKEN}/${method}`;
      const options = {
        method: "POST",
        headers: isFormData ? void 0 : { "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload)
      };
      const response = await fetch(url, options);
      return await response.json();
    }
    async function sendMessage(chatId, text, replyToMessageId = null, replyMarkup = null) {
      const payload = {
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      };
      if (replyToMessageId) {
        payload.reply_parameters = { message_id: replyToMessageId };
      }
      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }
      return await sendRequest("sendMessage", payload);
    }
    async function forwardMessage(chatId, originChatId, messageId) {
      const payload = {
        chat_id: chatId,
        from_chat_id: originChatId,
        message_id: messageId
      };
      return await sendRequest("forwardMessage", payload);
    }
    async function copyMessage(chatId, originChatId, messageId) {
      const payload = {
        chat_id: chatId,
        from_chat_id: originChatId,
        message_id: messageId
      };
      return await sendRequest("copyMessage", payload);
    }
  
    // src/utils/logics.js
    function isAdminReplyValid(replyMessage, args) {
      return replyMessage && !OWNER_IDS[0].includes(replyMessage.from.id) && args.length > 0;
    }
  
    // src/bot/commandHandler.js
    async function startCommand(message) {
      const { from: user, chat } = message;
      const response = Texts.startCommand.replace("{first_name}", user.first_name);
      const replyMarkup = {
        inline_keyboard: [[{ text: "Source Code", url: "https://github.com/lawdakacoder/ContactBot" }]]
      };
      await sendMessage(chat.id, response, message.message_id, replyMarkup);
    }
    async function banCommand(message, args) {
      const { from: user, chat, reply_to_message } = message;
      if (!OWNER_IDS[0].includes(user.id))
        return;
      if (isAdminReplyValid(reply_to_message, args)) {
        if (!reply_to_message?.forward_origin)
          return;
        const chatName = reply_to_message.forward_origin.sender_user_name ?? reply_to_message.forward_origin.sender_user.first_name;
        const chatId = await getChatId(reply_to_message.message_id);
        const response = Texts.chatBanned.replace("{chat_name}", chatName).replace("{chat_id}", chatId);
        await banChat(chatId, args.join(" "));
        await sendMessage(chat.id, response, message.message_id);
      } else {
        await sendMessage(chat.id, Texts.banCommand, message.message_id);
      }
    }
    async function unbanCommand(message) {
      const { from: user, chat, reply_to_message } = message;
      if (!OWNER_IDS[0].includes(user.id))
        return;
      if (reply_to_message?.forward_origin) {
        const chatName = reply_to_message.forward_origin.sender_user_name ?? reply_to_message.forward_origin.sender_user.first_name;
        const chatId = await getChatId(reply_to_message.message_id);
        const response = Texts.chatUnbanned.replace("{chat_name}", chatName).replace("{chat_id}", chatId);
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
    async function handleCommand(message) {
      const { text } = message;
      const [command, ...args] = text.split(" ");
      switch (command) {
        case "/start":
          await startCommand(message, args);
          break;
        case "/ban":
          await banCommand(message, args);
          break;
        case "/unban":
          await unbanCommand(message);
          break;
        case "/help":
          await helpCommand(message);
          break;
        default:
          await unknownCommand(message);
      }
    }
  
    // src/bot/replyHandler.js
    async function handleReply(message) {
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
  
    // src/bot/messageHandler.js
    async function sendToOwner(chatId, messageId) {
      const response = await forwardMessage(OWNER_IDS[1], chatId, messageId);
      await saveChatId(response.result.message_id, chatId);
    }
    async function handleMessage(message) {
      const { chat, text, forward_origin } = message;
      const owner = OWNER_IDS[1] === chat.id;
      if (forward_origin) {
        return;
      }
      if (text?.startsWith("/")) {
        return await handleCommand(message);
      }
      if (!owner) {
        if (chat.type !== "private") {
          return;
        }
        const { isBanned, banReason } = await banStatus(chat.id);
        if (isBanned) {
          const reason = Texts.chatIsBanned.replace("{reason}", banReason);
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
  
    // src/index.js
    addEventListener("fetch", (event) => {
      event.respondWith(handleRequest(event.request));
    });
    async function handleRequest(request) {
      const secret_token = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
      if (secret_token !== SECRET_TOKEN) {
        return new Response("Authentication Failed.", { status: 403 });
      }
      const data = await request.json();
      if (data.message) {
        await handleMessage(data.message);
      }
      return new Response("OK", { status: 200 });
    }
  })();
  //# sourceMappingURL=index.js.map
  
