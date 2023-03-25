import React from "react";
import css from "./styles.module.css";

// // // //

export function WebmailHelper(props: {
    onClickReadEmail: () => void;
    setFormality: (desired: string) =>  void;
}) {
    return (
        <div className="row">
            <div className="grid gap-3 grid-cols-2 mt-3 w-full">
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => props.setFormality("formal")}
                >
                    Formal
                </button>
                <button
                    className={css.btn}
                    data-testid="scroll-to-bottom"
                    onClick={() => props.setFormality("informal")}
                >
                    Informal
                </button>
            </div>
            <div className="grid gap-3 grid-cols-2 mt-3 w-full">
                <button
                    className={css.btn}
                    data-testid="scroll-to-top"
                    onClick={() => props.setFormality("concise")}
                >
                    Concise
                </button>
                <button
                    className={css.btn}
                    data-testid="scroll-to-bottom"
                    onClick={() => props.setFormality("funny")}
                >
                    Funny
                </button>
            </div>
        </div>
    );
}
