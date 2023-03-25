import React from "react";
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

function readEmail(position: number) {
    const selector = ".adn.ads";
    let email = document.querySelector(".adn.ads");
    console.log(email);

    let lines = email?.childNodes;
    // let lines = email?.querySelectorAll("div");


    let emailString = "";
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
    // if (email) {
    //     var tempDivElement = document.createElement("div");
    //     tempDivElement.innerHTML = email.outerHTML;

    //     // Retrieve the text property of the element
        
    
    //     let emailString = tempDivElement.textContent || tempDivElement.innerText || "";
    //     console.log(emailString);
    // } else {
    //     console.log("element was null.")
    // }
}

/**
 * Executes a string of Javascript on the current tab
 * @param code The string of code to execute on the current tab
 */
function executeScript(position: number): void {
    // Query for the active tab in the current window
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs: Tabs.Tab[]) => {
            // Pulls current tab from browser.tabs.query response
            const currentTab: Tabs.Tab | number = tabs[0];

            // Short circuits function execution is current tab isn't found
            if (!currentTab) {
                return;
            }
            const currentTabId: number = currentTab.id as number;

            // Executes the script in the current tab
            browser.scripting
                .executeScript({
                    target: {
                        tabId: currentTabId,
                    },
                    func: scrollWindow,
                    args: [position],
                })
                .then(() => {
                    console.log("Done Scrolling");
                });
        });
}

function executeReadEmail(): void {
    // Query for the active tab in the current window
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs: Tabs.Tab[]) => {
            // Pulls current tab from browser.tabs.query response
            const currentTab: Tabs.Tab | number = tabs[0];

            // Short circuits function execution is current tab isn't found
            if (!currentTab) {
                return;
            }
            const currentTabId: number = currentTab.id as number;

            // Executes the script in the current tab
            browser.scripting
                .executeScript({
                    target: {
                        tabId: currentTabId,
                    },
                    func: readEmail,
                })
                .then(() => {
                    console.log("Read Mail Contents.");
                });
        });
}

// // // //

export function Popup() {
    // Sends the `popupMounted` event
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    // Renders the component tree
    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                <Hello />
                <hr />
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopPosition);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomPosition);
                    }}
                />
                <hr />
                <WebmailHelper 
                    onClickReadEmail={() => {
                        executeReadEmail();
                    }}/>
            </div>
        </div>
    );
}
