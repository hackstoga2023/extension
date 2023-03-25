import React, { useEffect, useState } from "react";
import css from "./styles.module.css";

// // // //

/**
 * Component that renders buttons to scroll to the top and bottom of the page
 */
var currentUrl = "";

const newsWebsites = ['www.fox.com', 'www.cnn.com', 'www.nytimes.com', 'www.washingtonpost.com']
const emailsWebsites = ['www.gmail.com', 'www.outlook.com', 'www.yahoomail.com', 'mail.google.com', 'outlook.live.com']

//Returns current tab of chrome

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentUrl = "" + tabs[0].url?.split("/")[2];
    currentUrl = currentUrl.trim();
  });


function CheckUrl(props: {
    url: string
}){
    const { url } = props
    
    let returndom = (
        <></>
    )

    for(let i =0; i <newsWebsites.length; i++) {
        if(url === newsWebsites[i]) {
            returndom = (
                <div>
                    <h2>Actions:</h2>
                    <button>
                    Analyze Article
                    </button>   
                </div>

                
            )
        }
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
                    onClick={() => props.onClickScrollTop()}
                >
                    Scroll To Top
                </button>
                <button
                    className={css.btn}
                    data-testid="scroll-to-bottom"
                    onClick={() => props.onClickScrollBottom()}
                >
                    Scroll To Bottom
                </button>
            </div>
        </div>
    );
}
