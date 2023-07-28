import { css } from "@emotion/react";

export const bppx = {
	sps: 375,
	sp: 599,
	spl: 799,
	tabs: 899,
	tab: 1024,
	pc: 1425,
	max: 1426,
};

export const bpMin = {
	sps: "@media screen and  (min-width: 375px)",
	sp: "@media screen and  (min-width: 599px)",

	spl: "@media screen and  (min-width: 799px)",
	tabs: "@media screen and  (min-width: 899px)",
	tab: "@media screen and  (min-width: 1024px)",
	pc: "@media screen and  (min-width: 1425px)",
	max: "@media screen and  (min-width: 1426px)",
};

export const bp = {
	sps: "@media screen and  (max-width: 375px)",
	sp: "@media screen and  (max-width: 599px)",

	spl: "@media screen and  (max-width: 799px)",
	tabs: "@media screen and  (max-width: 899px)",
	tab: "@media screen and  (max-width: 1024px)",
	pc: "@media screen and  (max-width: 1425px)",
	max: "@media screen and  (max-width: 1426px)",
};

const breakpoints = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1300];

export const mqN = css`
    ${breakpoints.map((bp, id) => `@media (min-width: ${bp}px){font-size: ${1 + (id + 1) * 0.1}rem}`)}
`;

export const mqS = css`
    ${breakpoints.map((bp, id) => `@media (min-width: ${bp}px){font-size: ${1 + (id + 1) * 0.05}rem}`)}
`;

export const mqTitle = css`
    ${breakpoints.map((bp, id) => `@media (min-width: ${bp}px){font-size: ${1 + (id + 1) * 0.3}rem}`)}
`;

export const c = {
	mainPurple: "#1d2088",
	mainBlack: "#545554",
	mainGray: "#BBB",
	mainWhite: "#FFF",
	gray: "#7B7B7B",
	red: "#D92424",
	pink: "#e97ab1",
	dullpink: "#e0a5c8",
	orange: "#E36234",
	yellow: "#FFDF00",
	yelloworange: "#ECA71C",
	green: "#5EBC92",
	yellowgreen: "#78d38a",
	skyblue: "#7ecef4",
	blue: "#4684d2",
	purple: "#847dbf",
	redpurple: "#B26CAE",
	defaultBlue: "#1976d2",

	l_purple: "#DAC7F9",
	l_red: "#FCBAC6",
	l_pink: "#FCD4E3",
	l_green: "#b4efd3",
	l_blue: "#b7e1f8",
	l_yellow: "#FFE961",
	l_yelloworange: "#FECE7B",
	l_yellowbrown: "#E5D590",
	l_pureyellow: "#FFFA80",

	l2_purple: "#E7DCE4",
	l2_pink: "#feeef4",
	l2_green: "#D9F7E9",
	l2_blue: "#d6fcff",
	l2_yellow: "#FFF5B3",
	l2_yelloworange: "#fdedd1",
	l2_yellowbrown: "#f6f0d8",

	l3_purple: "#EBEAEC",
	l3_pink: "#FEF6F9",
	l3_green: "#E8F7F0",
	l3_blue: "#EBFEFF",
	l3_yellow: "#FFFAD9",
	l3_yelloworange: "#FDF7EB",
	l3_yellowbrown: "#F6F4EC",

	d_red: "#c32020",
	d_pink: "#d26e9f",
	d_orange: "#cc582f",
	d_yelloworange: "#d49619",
	d_green: "#55a983",
	d_yellow: "#CCB200",
	d_yellowgreen: "#76bc84",
	d_skyblue: "#71b9dc",
	d_blue: "#386aa8",
	d_purple: "#7461a3",
	d_redpurple: "#833f56",
	d_defaultBlue: "#176abd",
};

export const cArr = {
	gray: ["#f7f7f7", "#eeeeee", "#e6e6e6", "#dddddd", "#d5d5d5", "#cccccc", "#c4c4c4", "#bbbbbb", "#b3b3b3", "#aaaaaa"],
	pink: ["#FDF2F7", "#FADEEB", "#F6CAE0", "#F3B6D4", "#F0A2C8", "#EC8EBD", "#E97AB1", "#C26694", "#9C5176", "#753D59"],

	orange: ["#FCEFEB", "#F7D3C6", "#F2B7A2", "#ED9A7D", "#E87E59", "#E36234", "#C7562E", "#AB4A27", "#8E3D21", "#72311A"],
	yellow: ["#FFF9CC", "#FFF399", "#FFEC66", "#FFE633", "#FFDF00", "#DBC000", "#B7A100", "#948100", "#706200", "#4C4300"],
	yelloworange: ["#FDF6E8", "#FAE9C6", "#F7DCA4", "#F5CF82", "#F2C160", "#EFB43E", "#ECA71C", "#C58B17", "#9D7013", "#76540E"],
	green: ["#EFF8F4", "#D7EEE4", "#BFE4D3", "#A7DAC3", "#8ED0B3", "#76C6A2", "#5EBC92", "#4E9D7A", "#3F7D61", "#2F5E49"],
	yellowgreen: ["#F2FBF3", "#DEF4E1", "#C9EED0", "#B5E7BF", "#A1E0AD", "#8CDA9C", "#78D38A", "#60A96E", "#487E53", "#305437"],
	skyblue: ["#E5F5FD", "#CBEBFB", "#B2E2F9", "#98D8F6", "#7ECEF4", "#6CB1D2", "#5B94B0", "#49788D", "#385B6B", "#263E49"],
	blue: ["#EDF3FB", "#CCDDF3", "#AAC7EB", "#89B0E2", "#679ADA", "#4684D2", "#3D74B8", "#35639E", "#2C5383", "#234269"],
	purple: ["#F3F2F9", "#DDDBED", "#C7C3E2", "#B0ACD6", "#9A94CB", "#847DBF", "#7771AC", "#6A6499", "#5C5886", "#4F4B73"],
	redpurple: ["#F7F0F7", "#E9D6E8", "#DBBBDA", "#CEA1CB", "#C086BD", "#B26CAE", "#975C94", "#7D4C7A", "#623B60", "#472B46"],
};

export const f = {
	fontfamily_en_01: "'Futura PT','Futura-PT',sans-serif",
	fontfamily_jp_01: "'Noto Sans JP',sans-serif",
};
