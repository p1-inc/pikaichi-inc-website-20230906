import { width } from "@mui/system";
import { c, cArr } from "../../../styles/eStyle";
import { CSSObject } from "@mantine/core";
import { textColorList } from "./plugin/inlineTools/textColorPlugin";
import { markerColorList } from "./plugin/inlineTools/markerPlugin";

const displayBlockColor = {
	".ce-header": cArr.blue[3],
	".ce-paragraph": cArr.green[3],
	".post__imageGalleryPlugin": cArr.purple[3],
	".post__tablePlugin": cArr.yellowgreen[3],
	".ce-delimiter": cArr.pink[3],
	".ec__p_space": cArr.yelloworange[3],
};

const displayBlockList = {
	header: { id: "header", className: ".ce-header", color: cArr.blue[3] },
	paragraph: { id: "paragraph", className: ".ce-paragraph", color: cArr.green[3] },
	image: { id: "image", className: ".post__imageGalleryPlugin", color: cArr.purple[3] },
	table: { id: "table", className: ".post__tablePlugin", color: cArr.yellowgreen[3] },
	delimiter: { id: "delimiter", className: ".ce-delimiter", color: cArr.pink[3] },
	space: { id: "space", className: ".ec__p_space", color: cArr.yelloworange[3] },
};

export const P1_EditorStyle = ({ bg = false }) => {
	//textColor用CSS & markerColor用CSS
	//colorPluginからてcolorListを参照にclassのListを構築
	const textColor = textColorList.reduce((acc: { [index: string]: CSSObject }, item) => {
		acc[`.pe-inline_textColor-color-${item.label}`] = { color: item.value };
		return acc;
	}, {});
	const markerColor = markerColorList.reduce((acc: { [index: string]: CSSObject }, item) => {
		acc[`.pe-inline_marker-color-${item.label}`] = {
			background: `linear-gradient(transparent 70%, ${item.value} 0%)`,
		};
		return acc;
	}, {});

	return {
		".pe-block ": {},

		".pe-block *": {},
		".pe-block__content": {},

		".pe-block__content:focus-within": {
			outline: "none",
		},

		".pe-inline_bold": {},
		".pe-inline_italic": {},
		".pe-inline_link": { color: c.defaultBlue, cursor: "pointer", "&:hover": { opacity: 0.6 } },
		".pe-inline_textColor": {},
		".pe-inline_marker": {},

		".pe-popover--opened": {
			maxHeight: "fit-content",
		},

		"ul.pdx-list--unordered": {
			listStyle: "disc",
		},

		ul: {
			listStyle: "disc",
		},

		"ol.pdx-list--ordered": {
			listStyle: "decimal !important",
		},

		ol: {
			listStyle: "decimal",
		},

		...textColor,
		...markerColor,
	};
};
