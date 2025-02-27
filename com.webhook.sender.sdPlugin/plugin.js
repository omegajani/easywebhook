let websocket = null;
let pluginUUID = null;

function connectElgatoStreamDeckSocket(port, uuid, registerEvent) {
    pluginUUID = uuid;
    websocket = new WebSocket(`ws://localhost:${port}`);

    websocket.onopen = () => {
        const json = {
            event: registerEvent,
            uuid: pluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.event === "keyDown") {
            const webhookUrl = data.payload.settings.webhookUrl;
            sendWebhook(webhookUrl);
        }
    };
}

function sendWebhook(url) {
    if (!url) {
        console.error("Keine URL angegeben");
        return;
    }
    fetch(url, { method: "POST" })
        .then(response => console.log("Webhook gesendet:", response.status))
        .catch(err => console.error("Fehler:", err));
}
