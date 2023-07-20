/** @jsxImportSource @emotion/react */

import { useState, useEffect, useRef } from "react";
import { css } from "@emotion/react";

import { mqN, mqTitle, f, c, bp } from "../../styles/eStyle";

import s from "../../components/Main.module.scss";

type ButtonType = {
	text: string;
	width: string;
	size?: string;
	padding?: string;
	mr?: string;
	color?: string;
	bdColor?: string; //border-color
	bdWidth?: string; //border-width
	bgColor?: string; //background-color
	onclick: any;
};

export default function P1Button({
	text,
	width,
	size = "1.8em",
	padding = "0.5em",
	mr = "0",
	color = "#FFF",
	bdColor = "#FFF",
	bdWidth = "0",
	bgColor = "#FFF",
	onclick,
}: ButtonType) {
	//
	const btnStyle = css`
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: ${width};
        margin-right: ${mr};
        padding: ${padding};
        border-radius: 0.7em;
        border: ${bdWidth} solid ${bdColor};

        cursor: pointer;
        background-color: ${bgColor};
        transition: opacity 0.3s;
        &:hover {
            opacity: 0.5;
            transition: opacity 0.3s;
        }
    `;

	const textStyle = css`
        color: ${color};
        font-size: ${size};
        text-align: center;

        ${bp.sp} {
            font-size: 1.2em;
        }
    `;
	return (
		<a css={btnStyle} onClick={onclick}>
			<div css={textStyle}>{text}</div>
		</a>
	);
}
