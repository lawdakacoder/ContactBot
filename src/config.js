// Bot API server to use, by default official one.
const API_ROOT = 'https://api.telegram.org';
// Random long (32 is enough) url safe token.
// python -c "import secrets; print(secrets.token_urlsafe(32));"
const SECRET_TOKEN = '';
// Bot API token from @BotFather.
const BOT_TOKEN = '';

const OWNER_IDS = [
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

export {API_ROOT, SECRET_TOKEN, BOT_TOKEN, OWNER_IDS};