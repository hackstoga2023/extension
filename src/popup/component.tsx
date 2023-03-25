import React, { useEffect, useState } from "react";
import { Hello } from "@src/components/hello";
import browser, { Tabs } from "webextension-polyfill";
import { Scroller } from "@src/components/scroller";
import { NewsWebsites } from "@src/components/news";
import css from "./styles.module.css";
import { WebmailHelper } from "@src/components/webmail";



// // // //

// Scripts to execute in current tab
const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

function scrollWindow(position: number) {
    window.scroll(0, position);
}

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

var currentUrl = "";

const newsWebsites = ['www.bbc.com', 'www.cnn.com']
const emailsWebsites = ['www.gmail.com', 'www.outlook.com', 'www.yahoomail.com', 'mail.google.com', 'outlook.live.com']
export function Popup() {
    // Sends the `popupMounted` event

    // write a use effect to get the current browser url
    useEffect(() => {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            var url = new URL(tabs[0].url as string);
            currentUrl = url.hostname;
            seturl(currentUrl)
        })
    }, [])
    const [url, seturl] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [msg, setmsg] = useState<string>("TestMsg");

    const doReadEmail = async () => {
        const data = await readEmail();
        setemail(data);
        const airesp = await browser.runtime.sendMessage({
            mode: "email",
            input: data
        })
        const msg = airesp.choices[0].message.content
        console.log(msg)
        setmsg(msg);
    }
    return (
        <div className={css.popupContainer}>
            <div className="bg-[#1b1b1b] flex flex-col items-center w-full text-white">

                <h1 className="font-bold text-white text-xl mt-6">Chrome Buddy</h1>
                <div className="wrapper text-sm mt-4 text-gray-500">
                    {
                        url === "" ? <p>Navigate to one of our supported websites for features like news summaries and email suggestions</p> : <p>Current URL: {url}</p>
                    }
                </div>
                {
                    newsWebsites.includes(url) ? <NewsWebsites url={url} /> : <></>
                }
                <div className="email mt-6">
                    {
                        url === "mail.google.com" ? <>
                            <WebmailHelper
                                onClickReadEmail={() => {
                                    doReadEmail()
                                }} />
                        </> : <></>
                    }
                </div>

            </div>
        </div>
    );
}
