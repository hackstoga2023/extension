import React, { useState } from "react";
import { Hello } from "@src/components/hello";
import browser, { Tabs } from "webextension-polyfill";
import { Scroller } from "@src/components/scroller";
import css from "./styles.module.css";

// // // //

// Scripts to execute in current tab
const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

function scrollWindow(position: number) {
    window.scroll(0, position);
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

// // // //

export function Popup() {
    // Sends the `popupMounted` event

    const [msg, setmsg] = useState<string>("TestMsg");
    const getEngines = async () => {
        const response = await browser.runtime.sendMessage({
            mode: "email",
            input: "none"
        });
        setmsg(JSON.stringify(response));
    }
    // Renders the component tree
    return (
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                <Hello />
                <hr />
                {msg}
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopPosition);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomPosition);
                    }}
                />

                <button onClick={getEngines}>List engines</button>

            </div>
        </div>
    );
}
