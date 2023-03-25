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

        
            return email?.textContent;
        }
    })
    return data[0].result;
}

function cleanBBCData(data:string){
    var tempData = data.substring(0, data.lastIndexOf("Related Topics"));
    console.log(tempData)
    return tempData;

}

function cleanCNNData(data:string){
    var tempData = ""
    if(data.indexOf("Enter your email") != -1)
        tempData = data.substring(0, data.lastIndexOf("Enter your email")) + data.substring(data.lastIndexOf("}"));
    else{
        tempData = data.substring(0, data.indexOf("{")) + data.substring(data.lastIndexOf("}"))
    }
    console.log(tempData);
    return tempData;
} 

export function NewsWebsites(props: {
    url: string
}) {

    const [summary, setSummary] = useState<string>("");
    const getbbc = async () => {
        const data = await readBBCArticle();
        const summary = await browser.runtime.sendMessage({
            mode: "summarize",
            input: cleanBBCData(data)
        });
        console.log(summary)
        setSummary(summary)
    }

    const getcnn = async () =>{
        const data = await readCNNArticle();
        const summary = await browser.runtime.sendMessage({
            mode: "summarize",
            input: cleanCNNData(data)
        });
        setSummary(summary);
    }

    async function checkUrl(){
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        
        var url = tabs[0].url?.split("/")[2];

        console.log(url);

        if(url === 'www.bbc.com'){
            getbbc();
        }

        if(url === 'www.cnn.com'){
            getcnn();
        }


    }
    return (
        <div className="wrapper">
            <button onClick={() => checkUrl()}>Summarize Article</button>
            <p>{summary}</p>
        </div>

    );
}
