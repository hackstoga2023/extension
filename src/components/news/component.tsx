import React, { useEffect, useState } from "react";
import css from "./styles.module.css";
import browser, { Tabs } from "webextension-polyfill";

// // // //
async function readBBCArticle() {

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const currentTabId = currentTab.id as number;

    const data = await browser.scripting.executeScript({
        target: {
            tabId: currentTabId
        },
        func: () => {
            let email = document.querySelector("#main-content > article");

            console.log(email);

            let lines = email?.childNodes;
            // let lines = email?.querySelectorAll("div");


            let emailString = "";

            // emailString += document.querySelector("#\\:24 > div.adn.ads > div.gs > div.gE.iv.gt > table > tbody > tr:nth-child(1) > td.gF.gK > table > tbody > tr > td > h3 > span > span > span")?.textContent;
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
                } else {
                    console.log("no content");
                    emailString += " ";
                }
            })

            console.log(emailString);
            return emailString
        }
    })
    return data[0].result;
}


export function NewsWebsites(props: {
    url: string
}) {

    const [summary, setSummary] = useState<string>("");
    const getbbc = async () => {
        const data = await readBBCArticle();
        const summary = await browser.runtime.sendMessage({
            mode: "summarize",
            input: data
        });
        setSummary(summary)
    }
    return (
        <div className="wrapper">
            <button onClick={() => getbbc()}>Summarize Article</button>
            <p>{summary}</p>
        </div>

    );
}
