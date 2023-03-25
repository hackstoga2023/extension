import { Runtime } from "inspector";
import browser from "webextension-polyfill";
interface Message {
    mode: string,
    input: string,
}

browser.runtime.onMessage.addListener(
    async (message: Message, sender) => {

        switch (message.mode) {
            case "email":
                console.log("Making req")
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    headers: {
                        "Authorization": "Bearer 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",
                        "OpenAI-Organization": "org-nPujVuZtkzTfCsljKAsPXe8a",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": [{ "role": "user", "content": "Hello!" }]
                    })
                })

                const jsonResponse = await response.json();
                return Promise.resolve(jsonResponse)
                break;
            case "news":

                break;
        }
    }
);

// browser.runtime.onMessage.addListener(
//     (message: Message, sender: browser.runtime.MessageSender, sendResponse: (response?: any) => void) => {
//         // Log statement if request.popupMounted is true
//         // NOTE: this request is sent in `popup/component.tsx`
//         if (request.popupMounted) {
//             fetch("https://api.openai.com/v1/models", {
//                 headers: {
//                     "Authorization": "Bearer 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",
//                     "OpenAI-Organization": "org-nPujVuZtkzTfCsljKAsPXe8a",
//                     "Content-Type": "application/json"
//                 }
//             }).then(response => response.json()).then(data => console.log(data));
//             console.log("backgroundPage notified that Popup.tsx has mounted. !");
//             sendResponse("");
//         }
//     });