export const Texts = {
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
    banCommand: 'Send <code>/ban</code> with reason as reply to an user message to ban the user.',
    unbanCommand: 'Send <code>/unban</code> as reply to an user message to unban the user.',
    unknownCommand: 'Unknown command! Send <code>/help</code> to get list of available commands.',
    chatBanned: 'Banned <b>{chat_name}</b> (<code>{chat_id}</code>).',
    chatIsBanned: '<b>Sorry, you are banned from using this bot!</b>\n\n<b>Reason:</b>\n{reason}',
    chatUnbanned: 'Unbanned <b>{chat_name}</b> (<code>{chat_id}</code>).',
    notValidArgument: 'The provided argument is invalid.'
};