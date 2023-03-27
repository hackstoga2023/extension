import { Runtime } from "inspector";
import browser from "webextension-polyfill";
interface Message {
    mode: string,
    input: string,
    formality: string,
}
// make api calls
browser.runtime.onMessage.addListener(
    async (message: Message, sender) => {
        let resp;
        const apikey = "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"
        switch (message.mode) {
            case "email":
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    headers: {
                        "Authorization": "Bearer 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",
                        "OpenAI-Organization": "org-TA6t5XiBxVePWznk6AYXMarE",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": [{ "role": "user", "content": `The below is a an email I have recieved please come up with a ${message.formality}, contextual response to it. ${message.input}` }]
                    })
                })

                const jsonResponse = await response.json();
                resp = Promise.resolve(jsonResponse)
                break;
            case "news":
                const newsresponse = await fetch("https://api.openai.com/v1/chat/completions", {
                    headers: {
                        "Authorization": "Bearer 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",
                        "OpenAI-Organization": "org-TA6t5XiBxVePWznk6AYXMarE",
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "model": "gpt-3.5-turbo",
                        "messages": [{ "role": "user", "content": `Please summarize the following news article as unbiased as you can, ${message.input}` }]
                    })
                })

                const newsjsonResponse = await newsresponse.json();
                resp = Promise.resolve(newsjsonResponse)
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
        return resp;
    }
);
