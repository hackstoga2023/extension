import browser from "@src/__mocks__/webextension-polyfill";
import { exec } from "child_process";
import React, { useEffect, useState } from "react";
import { Tabs } from "webextension-polyfill";
import css from "./styles.module.css";

// // // //

/**
 * Component that renders buttons to scroll to the top and bottom of the page
 */
var currentUrl = "";

const newsWebsites = ['www.bbc.com', 'www.cnn.com']
const emailsWebsites = ['www.gmail.com', 'www.outlook.com', 'www.yahoomail.com', 'mail.google.com', 'outlook.live.com']

function readBBCArticle(){
    
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

}


//Returns current tab of chrome

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentUrl = "" + tabs[0].url?.split("/")[2];
    currentUrl = currentUrl.trim();
  });

  function executeReadBBCArticle(): void {
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
                    func: readBBCArticle,
                })
                .then(() => {
                    console.log("Read Mail Contents.");
                });
        });

        
}


function CheckUrl(props: {
    url: string
}){
    const { url } = props
    
    let returndom = (
        <></>
    )

    if(url === newsWebsites[0]){
        executeReadBBCArticle();

    }
        
    for(let i =0; i <emailsWebsites.length; i++) {
        if(url === emailsWebsites[i]) {
            returndom = (
                <div className="grid gap-3 grid-cols-2 mt-3 w-full">
                    <h2>Actions:</h2>
                    <button className={css.button}>
                    Formulate Response
                    </button>   
                </div>
            )
        }
    }

    return returndom
}


export function Scroller(props: {
    onClickScrollTop: () => void;
    onClickScrollBottom: () => void;
    
} ) {
    
    return (

        // displays current url of tab
        <div >
            <h3 >Current Website:</h3>
            <p>{currentUrl}</p>

            <CheckUrl url={currentUrl}/>


                        
            <div className="grid gap-3 grid-cols-2 mt-3 w-full">   
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => executeReadBBCArticle}
                >
                    Summarize Article
                </button>
                
            </div>
        </div>
    );
}
