/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect, useRef } from "react";

import s from "../../components/Main.module.scss";

type P1SlType = {
    label: string;
    width: string;
    borderColor: string;
    placeholder: string;
    name: string;

    onchange: any;
    value: string;
    required: boolean;
    validation: string;
};

export default function P1Select({
    label,
    width,
    borderColor,
    placeholder,
    items,
    name,
    type,
    onchange,
    value,
    required,
    validation,
}: any) {
    const [toggleClick, isToggleClick] = useState(false);
    const [selectValue, setSelectValue] = useState(value);

    const textField = {
        display: "block",
        textAlign: "center",
    };

    const wrapperStyle = css`
        display: block;
        position: relative;
        margin: 0 auto;
        margin-bottom: 2em;
        width: ${width}%;

        font-size: 1em;
        box-sizing: border-box;
    `;

    const selectStyle = css`
        display: block;
        width: 15em;
        padding: 0.5em;
        border: ${validation ? `0.2em solid red` : `0.2em solid ${borderColor}`};
        border-radius: 0.7em;
        font-size: 1.2em;
        padding: 0.2em 1em 0.2em 1em;
        &:focus {
            outline: none;
        }

        ${"@media screen and  (max-width: 599px)"} {
            border: ${validation ? `2px solid red` : `2px solid ${borderColor}`};
            font-size: 1em;
        }
    `;

    const ph = css`
        cursor: default;
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 1em;

        transform: ${toggleClick || selectValue
            ? "translate(-10%, -130%) scale(70%)"
            : "translate(0%, -50%) scale(100%)"};
        transition: 0.2s;
        color: #000;
        font-size: 1.2em;
        background-color: #fff;
        padding: 0 0.5em 0 0.5em;

        ${"@media screen and  (max-width: 599px)"} {
            font-size: 1em;
        }
    `;

    const validationStyle = css`
        position: absolute;
        left: 1em;
        color: red;
    `;

    return (
        <>
            <div css={wrapperStyle}>
                <select css={selectStyle} onChange={onchange}>
                    {items.map((item: any) => (
                        <option hidden={item.hidden} key={item.value} value={item.value}>
                            {item.text}
                        </option>
                    ))}
                </select>

                <div css={validationStyle}>{validation}</div>
            </div>
        </>
    );
}
