/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect, useRef } from "react";

type P1TaType = {
    width: string;
    borderColor: string;
    placeholder: string;
    name: string;
    type: string;
    rows?: number;
    onchange: any;
    value: string;
    required: boolean;
    validation: string;
};
export default function P1TextArea({
    width,
    borderColor,
    placeholder,
    name,
    type,
    rows = 3,
    onchange,
    value,
    required,
    validation,
}: P1TaType) {
    const [toggleClick, isToggleClick] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const textField = {
        display: "block",
        textAlign: "center",
    };

    const wrapperStyle = css`
        display: block;
        position: relative;
        margin-bottom: 2em;
        width: ${width}%;
        font-size: 1.2em;
    `;

    const inputStyle = css`
        resize: vertical;
        display: block;
        width: 100%;
        padding: 0.5em;
        border: ${validation ? `0.2em solid red` : `0.2em solid ${borderColor}`};
        border-radius: 0.7em 0.7em 0 0.7em;
        font-size: 1em;

        &:focus {
            outline: none;
        }

        ${"@media screen and  (max-width: 599px)"} {
            border: ${validation ? `2px solid red` : `2px solid ${borderColor}`};
            font-size: 0.8em;
        }
    `;

    const ph = css`
        cursor: default;
        pointer-events: none;
        position: absolute;
        height: 1em;
        top: 1em;
        left: 1em;
        transform: ${toggleClick || inputValue
            ? "translate(-10%, -130%) scale(70%)"
            : "translate(0%, -50%) scale(100%)"};
        transition: 0.2s;
        color: #545454;
        font-size: 1em;
        background-color: #fff;
        padding: 0 0.2em 0 0.2em;

        ${"@media screen and  (max-width: 599px)"} {
            font-size: 0.8em;
        }
    `;

    const validationStyle = css`
        position: absolute;
        left: 1em;
        color: red;
    `;

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <>
            <div css={wrapperStyle}>
                <textarea
                    css={inputStyle}
                    id="email"
                    required={required}
                    name={name}
                    rows={rows}
                    onFocus={() => {
                        isToggleClick(true);
                    }}
                    onBlur={() => {
                        isToggleClick(false);
                    }}
                    onChange={onchange}
                />
                <div css={ph}>{placeholder}</div>
                <div css={validationStyle}>{validation}</div>
            </div>
        </>
    );
}
