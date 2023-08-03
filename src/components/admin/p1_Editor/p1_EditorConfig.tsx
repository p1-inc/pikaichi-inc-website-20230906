import { BlockToolType, InlineToolType, P1GlobalClassNameType } from "./p1_EditorTypes";
import {
	IconLanguageKatakana,
	IconHeading,
	IconPhoto,
	IconTable,
	IconLineDashed,
	IconQuote,
	IconList,
	IconBold,
	IconItalic,
	IconLink,
	IconTextColor,
	IconHighlight,
	IconSeparatorHorizontal,
	IconCode,
	IconMovie,
} from "@tabler/icons-react";
import { Header } from "./plugin/blockTools/headerPlugin";
import { Paragraph } from "./plugin/blockTools/paragraphPlugin";
import { TableTool } from "./plugin/blockTools/tableToolsPlugin";
import { ImageTool } from "./plugin/blockTools/imageToolsPlugin";
import { DelimiterTool } from "./plugin/blockTools/delimiterPlugin";
import { QuoteTool } from "./plugin/blockTools/quotePlugin";

import { SpaceTool } from "./plugin/blockTools/spacePlugin";
import { handleToInlineBold } from "./plugin/inlineTools/inlineBoldPlugin";
import { handleToInlineItalic } from "./plugin/inlineTools/inlineItalicPlugin";
import { handleToInlineLink } from "./plugin/inlineTools/inlineLinkPlugin";
import { handleToTextColor } from "./plugin/inlineTools/textColorPlugin";
import { handleToMarker } from "./plugin/inlineTools/markerPlugin";
import { ListTool } from "./plugin/blockTools/listPlugin";

import { c, cArr } from "../../../styles/eStyle";
import { MovieTool } from "./plugin/blockTools/movieToolsPlugin";

type ConfigType = {
	blockTools: BlockToolType[];
	tuneBlocksList: string[][];
	inlineTools: InlineToolType[];
	p1GlobalClassName: P1GlobalClassNameType;
	defaultTool: string;
};

export const config: ConfigType = {
	blockTools: [
		{
			id: "header",
			label: "見出し",
			icon: <IconHeading width="1em" />,
			className: "pe-block_header",
			component: Header,
			inlinetoolbarList: [],
			isContentEditable: true,
			defaultData: { align: "left", lineHeight: 2, level: 2, style: "none", text: "タイトル" },
			markerColor: cArr.blue[1],
		},
		{
			id: "paragraph",
			label: "本 文",
			icon: <IconLanguageKatakana width="1em" />,
			className: "pe-block_paragraph",
			component: Paragraph,
			inlinetoolbarList: [],
			isContentEditable: true,
			defaultData: { align: "left", lineHeight: 2.4, text: "" },
			markerColor: cArr.green[1],
		},
		{
			id: "imageTool",
			label: "画 像",
			icon: <IconPhoto width="1em" />,
			className: "pe-block_image",
			component: ImageTool,
			inlinetoolbarList: [],
			isContentEditable: false,
			defaultData: { align: "left", imgId: "", size: "m" },
			markerColor: cArr.purple[1],
		},
		{
			id: "movie",
			label: "動画埋め込み",
			icon: <IconMovie width="1em" />,
			className: "pe-block_movie",
			component: MovieTool,
			inlinetoolbarList: [],
			isContentEditable: false,
			defaultData: { align: "left", src: "", size: "m" },
			markerColor: cArr.yellowgreen[1],
		},
		{
			id: "tableTool",
			label: "表組み",
			icon: <IconTable width="1em" />,
			className: "pe-block_table",
			component: TableTool,
			inlinetoolbarList: [],
			isContentEditable: false,
			defaultData: { align: "left", tableId: "", size: "m" },
			markerColor: cArr.yelloworange[1],
		},
		{
			id: "delimiter",
			label: "区切り線",
			icon: <IconLineDashed width="1em" />,
			className: "pe-block_delimiter",
			component: DelimiterTool,
			inlinetoolbarList: [],
			isContentEditable: false,
			defaultData: { align: "center", type: "solid", weight: "xs", color: "gray" },
			markerColor: cArr.pink[1],
		},

		{
			id: "quote",
			label: "引 用",
			icon: <IconQuote width="1em" />,
			className: "pe-block_quote",
			component: QuoteTool,
			inlinetoolbarList: [],
			isContentEditable: true,
			defaultData: { align: "left", bcColor: "skyblue", text: "" },
			markerColor: cArr.orange[1],
		},
		{
			id: "list",
			label: "リスト",
			icon: <IconList width="1em" />,
			className: "pe-block_list",
			component: ListTool,
			inlinetoolbarList: [],
			isContentEditable: true,
			defaultData: { align: "left", style: "disc", color: "none", text: "" },
			markerColor: cArr.redpurple[1],
		},
		{
			id: "space",
			label: "スペース",
			icon: <IconSeparatorHorizontal width="1em" />,
			className: "pe-block_space",
			component: SpaceTool,
			inlinetoolbarList: [],
			isContentEditable: false,
			defaultData: { height: 2 },
			markerColor: cArr.skyblue[1],
		},
	],

	tuneBlocksList: [["header", "paragraph", "quote", "list"]],

	inlineTools: [
		{
			id: "bold",
			label: "太 字",
			icon: <IconBold strokeWidth={3.5} />,
			className: "pe-inline_bold",
			handle: handleToInlineBold,
		},
		{
			id: "italic",
			label: "イタリック",
			icon: <IconItalic />,
			className: "pe-inline_italic",
			handle: handleToInlineItalic,
		},
		{
			id: "link",
			label: "リンク",
			icon: <IconLink />,
			className: "pe-inline_link",
			handle: handleToInlineLink,
		},
		{
			id: "textColor",
			label: "文字色",
			icon: <IconTextColor />,
			className: "pe-inline_textColor",
			handle: handleToTextColor,
		},
		{
			id: "marker",
			label: "マーカー",
			icon: <IconHighlight />,
			className: "pe-inline_marker",
			handle: handleToMarker,
		},
	],
	p1GlobalClassName: { blockWrapper: "pe-blockWrapper", block: "pe-block", blockContent: "pe-block__content" },

	defaultTool: "paragraph",
};

export const inlineToolClassNames = config.inlineTools.map((d) => d.className);

export const LLABClassName = "last-line-after-break";
