import React, { useState } from "react";
import { Hello } from "@src/components/hello";
import browser, { Tabs } from "webextension-polyfill";
import { Scroller } from "@src/components/scroller";
import css from "./styles.module.css";
import { KeyField } from "@src/components/keyfield";
import { WebmailHelper } from "@src/components/webmail";
import { stringify } from "querystring";



// // // //

// Scripts to execute in current tab
const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

function scrollWindow(position: number) {
    window.scroll(0, position);
}

function cleanBBCData(data:string){
    var tempData = data.substring(0, data.lastIndexOf("Related Topics"));
    return tempData;

}

function cleanCNNData(data:string){
    var tempData = data.substring(0, data.lastIndexOf("Enter your email")) + data.substring(data.lastIndexOf("}"));
    return tempData;
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

async function readCNNArticle() {

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const currentTabId = currentTab.id as number;

    const data = await browser.scripting.executeScript({
        target: {
            tabId: currentTabId
        },
        func: () => {
            let email = document.querySelector("body > div.layout__content-wrapper.layout-with-rail__content-wrapper > section.layout__wrapper.layout-with-rail__wrapper > section.layout__main-wrapper.layout-with-rail__main-wrapper > section.layout__main.layout-with-rail__main > article > section > main > div.article__content-container");            
            console.log(email?.textContent);

            let lines = email?.childNodes;
            // let lines = email?.querySelectorAll("div");


            let emailString = "";

            // emailString += document.querySelector("#\\:24 > div.adn.ads > div.gs > div.gE.iv.gt > table > tbody > tr:nth-child(1) > td.gF.gK > table > tbody > tr > td > h3 > span > span > span")?.textContent;
            // lines?.forEach((element) => {
            //     if (element.textContent) {
            //         let bodyText = (element as HTMLElement).querySelector("#\\:26 > div:nth-child(1)");
            //         if (bodyText) {
            //             bodyText?.childNodes.forEach((bodyElement) => {
            //                 if (bodyElement) {

            //                     emailString += bodyElement.textContent + " ";

            //                 } else {
            //                     emailString += element.textContent;
            //                 }
            //             })
            //         } else {
            //             emailString += element.textContent + " ";
            //         }
            //     } else {
            //         console.log("no content");
            //         emailString += " ";
            //     }
            // })

            console.log(emailString);
            return email?.textContent;
        }
    })
    return data[0].result;
}

const newsWebsites = ['www.bbc.com', 'www.cnn.com']
const emailsWebsites = ['www.gmail.com', 'www.outlook.com', 'www.yahoomail.com', 'mail.google.com', 'outlook.live.com']
export function Popup() {
    // Sends the `popupMounted` event

    const [email, setemail] = useState<string>("");
    const [msg, setmsg] = useState<string>("TestMsg");
    const [bbcdata, setbbcdata] = useState<string>("");
    const [cnndata, setcnnData] = useState<string>("");
    const getbbc = async () => {
        const data = await readBBCArticle();
        
        setbbcdata(data);
        
    }

    const getcnn = async () => {
        const data = await readCNNArticle();
        
        setcnnData(data);
        
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

                <p>BBC: {cleanBBCData(bbcdata)}</p>
                <button onClick={getbbc}>Get BBC</button>

                <hr/>

                <p>CNN: {cleanCNNData(cnndata)}</p>
                <button onClick={getcnn}>Get CNN</button>


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
