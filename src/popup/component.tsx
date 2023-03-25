import React, { useState } from "react";
import { Hello } from "@src/components/hello";
import browser, { Tabs } from "webextension-polyfill";
import { Scroller } from "@src/components/scroller";
import css from "./styles.module.css";
import { KeyField } from "@src/components/keyfield";
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
var currentUrl = "";

const newsWebsites = ['www.bbc.com', 'www.cnn.com']
const emailsWebsites = ['www.gmail.com', 'www.outlook.com', 'www.yahoomail.com', 'mail.google.com', 'outlook.live.com']
export function Popup() {
    // Sends the `popupMounted` event

    const [email, setemail] = useState<string>("");
    const [msg, setmsg] = useState<string>("TestMsg");
    const [bbcdata, setbbcdata] = useState<string>("");
    const getbbc = async () => {
        const data = await readBBCArticle();
        setbbcdata(data);
    }
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
            <div className="mx-4 my-4">

                <p>BBC: {bbcdata}</p>
                <button onClick={getbbc}>Get BBC</button>

                <hr />
                <p>Email: {email}</p>
                <WebmailHelper
                    onClickReadEmail={() => {
                        doReadEmail()
                    }} />
                <hr />
                {msg}
            </div>
        </div>
    );
}
