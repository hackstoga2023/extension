import { Runtime } from "inspector";
import browser from "webextension-polyfill";
interface Message {
    mode: string,
    input: string,
    formality: string,
}

browser.runtime.onMessage.addListener(
    async (message: Message, sender) => {

        const apikey = "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"
        switch (message.mode) {
            case "email":
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    headers: {
                        "Authorization": "Bearer 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",
                        "OpenAI-Organization": "org-nPujVuZtkzTfCsljKAsPXe8a",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": [{ "role": "user", "content": `The below is a an email I have recieved please come up with a ${message.formality}, contextual response to it. ${message.input}` }]
                    })
                })

                const jsonResponse = await response.json();
                return Promise.resolve(jsonResponse)
                break;
            case "news":

                break;
            case "checkkey":
                const modelResponse = await fetch("https://api.openai.com/v1/models", {
                    headers: {
                        "Authorization": `Bearer ${apikey}`
                    }
                })
                const jsonModelResponse = await modelResponse.json();
                console.log(jsonModelResponse)
                return Promise.resolve("")
                break;
        }
    }
);
