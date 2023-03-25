import React, { useEffect, useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import css from "./styles.module.css";

// // // //
// scraper for emails
async function readEmail() {

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const currentTabId = currentTab.id as number;

    const data = await browser.scripting.executeScript({
        target: {
            tabId: currentTabId
        },
        func: () => {
            let email = document.querySelector(".adn.ads");
            let lines = email?.childNodes;
            // let lines = email?.querySelectorAll("div");
            let emailString = "";

            emailString += document.querySelector("#\\:24 > div.adn.ads > div.gs > div.gE.iv.gt > table > tbody > tr:nth-child(1) > td.gF.gK > table > tbody > tr > td > h3 > span > span > span")?.textContent;
            lines?.forEach((element) => {
                if (element.textContent) {
                    let bodyText = (element as HTMLElement).querySelector("#\\:26 > div:nth-child(1)");
                    if (bodyText) {
                        bodyText?.childNodes.forEach((bodyElement) => {
                            if (bodyElement) {

                                emailString += bodyElement.textContent + " ";

                            } else {
                                emailString += element.textContent;
                            }
                        })
                    } else {
                        emailString += element.textContent + " ";
                    }
                    // element.textContent = "painting";
                } else {
                    console.log("no content");
                    emailString += " ";
                }
            })
            console.log(emailString)
            return emailString;
        }
    })
    return data[0].result;
}
export function WebmailHelper() {

    const [msg, setmsg] = useState<string>("");

    const doReadEmail = async (formatlity: string) => {
        setmsg("Reading Email...");
        const data = await readEmail();
        setmsg("Generating Email...");
        const airesp = await browser.runtime.sendMessage({
            mode: "email",
            input: data,
            formality: formatlity
        })
        const msg = airesp.choices[0].message.content
        setmsg(msg);
    }


    async function confirmReply() {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        const currentTabId = currentTab.id as number;

        const data = await browser.scripting.executeScript({
            target: {
                tabId: currentTabId
            },
            func: (msg) => {
                (document.querySelector("#\\:21") as HTMLButtonElement).click();

                setTimeout(() => { (document.querySelector(".editable") as HTMLDivElement).innerHTML = msg; }, 1000);
            },
            args: [msg]
        })
    }




    return (
        <div className="row">
            <div className="grid gap-3 grid-cols-2 mt-3 w-full">
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => doReadEmail("formal")}
                >
                    Formal
                </button>
                <button
                    className={css.btn}
                    data-testid="scroll-to-bottom"
                    onClick={() => doReadEmail("informal")}
                >
                    Informal
                </button>
            </div>
            <div className="grid gap-3 grid-cols-2 mt-3 w-full">
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => doReadEmail("concise")}
                >
                    Concise
                </button>
                <button
                    className={css.btn}
                    data-testid="scroll-to-bottom"
                    onClick={() => doReadEmail("funny")}
                >
                    Funny
                </button>
            </div>
            <button onClick={confirmReply}>Test</button>
            <div className="output mt-2 px-10 text-md text-white">
                {msg}
            </div>
        </div>
    );
}
