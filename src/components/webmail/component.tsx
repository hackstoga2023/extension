import React from "react";
import css from "./styles.module.css";

// // // //

export function WebmailHelper(props: {
    onClickReadEmail: () => void;
    }) {
    return (
        <div className="row">
            <div className="col-lg-12 text-center">
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => props.onClickReadEmail()}
                >
                    Scroll To Top
                </button>
            </div>
        </div>
    );
}
