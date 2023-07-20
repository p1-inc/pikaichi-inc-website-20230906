import { c, f } from "../styles/eStyle";

import { CSSObject } from "@mantine/core";

export const globalStyle: CSSObject = {
	"*, *:before, *:after": {
		boxSizing: "border-box",
		fontFamily: f.fontfamily_jp_01,
		fontWeight: "normal",
		margin: 0,
		padding: 0,
		border: 0,
	},

	html: {
		fontSize: "16px",
		// WebkitTapHighlightColor: "transparent",
	},

	body: {
		boxSizing: "border-box",
	},

	"ol, ul, li": {
		listStyle: "none",
	},

	"a,p": {
		textDecoration: "none",
		color: c.mainBlack,
	},

	"a :hover": {
		opacity: 0.7,
		transition: "opacity 0.1s",
	},
};
