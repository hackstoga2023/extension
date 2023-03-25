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
    const [msg, setmsg] = useState<string>("Choose a desired formality above.");
    let desiredFormality = "formal";


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
                            <WebmailHelper />
                        </> : <></>
                    }
                </div>

            </div>
        </div>
    );
}
