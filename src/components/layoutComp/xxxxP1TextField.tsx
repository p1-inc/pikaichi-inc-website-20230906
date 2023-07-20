/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

import { useState, useEffect, useRef } from "react";

import s from "../../components/Main.module.scss";

type P1TfType = {
	width: string;
	borderColor: string;
	placeholder: string;
	name: string;
	onchange: any;
	value: string;
	required: boolean;
	validation: string;
};

export default function P1TextField({ width, borderColor, placeholder, name, onchange, value, required, validation }: P1TfType) {
	const [toggleClick, isToggleClick] = useState(false);
	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const wrapperStyle = css`
        display: block;
        position: relative;
        margin-bottom: 2em;
        width: ${width}%;
        font-size: 1em;
        box-sizing: border-box;
    `;

	const inputStyle = css`
        display: block;
        width: 100%;
        padding: 0.5em;
        border: ${validation ? `0.2em solid red` : `0.2em solid ${borderColor}`};
        border-radius: 0.7em;
        font-size: 1.2em;

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
        top: 50%;
        left: 1em;

        transform: ${toggleClick || inputValue ? "translate(-10%, -130%) scale(70%)" : "translate(0%, -50%) scale(100%)"};
        transition: 0.2s;
        color: #545454;
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
		<div css={wrapperStyle}>
			<input
				css={inputStyle}
				required={required}
				name={name}
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
	);
}
