import { SECRET_TOKEN } from "./config";
import { handleMessage } from "./bot/messageHandler";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    const secret_token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');

    if (secret_token !== SECRET_TOKEN) {
        return new Response('Authentication Failed.', { status: 403 });
    }

    const data = await request.json();

	if (data.message) {
		await handleMessage(data.message);
	}

    return new Response('OK', { status: 200 });

}