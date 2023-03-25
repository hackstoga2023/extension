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

function readEmail() {
    console.log("reading email")
    const selector = ".adn.ads";
    let email = document.querySelector(".adn.ads");
    console.log(email);

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


// // // //

export function Popup() {
    // Sends the `popupMounted` event

    const [msg, setmsg] = useState<string>("TestMsg");

    const doReadEmail = () => {
        const data = readEmail();
        console.log("trying to read email");
        setmsg(data)
    }
    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                <hr />
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
