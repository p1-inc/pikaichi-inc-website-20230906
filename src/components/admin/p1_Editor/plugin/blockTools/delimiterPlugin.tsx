import { Box, Divider, Flex, NavLink, NumberInput, Text, Button, Menu } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { c, cArr } from "../../../../../styles/eStyle";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties } from "react";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";

type DelimiterType = "solid" | "dashed" | "birdTracks" | "threePoints" | "stars" | "handLine";
type DelimiterWeight = "xl" | "md" | "sm" | "xs";
type DelimiterColor = keyof typeof cArr;

type DataType = {
	align?: CSSProperties["textAlign"];
	type: DelimiterType;
	weight: DelimiterWeight;
	color: DelimiterColor;
	className: string;
};

const delimiterStyle: { id: DelimiterType; label: string }[] = [
	{ id: "solid", label: "実 線" },
	{ id: "dashed", label: "点 線" },
	{ id: "birdTracks", label: "鳥の足跡" },
	{ id: "threePoints", label: "丸" },
	{ id: "stars", label: "スター" },
	{ id: "handLine", label: "くるくる" },
];

const delimiterWeight: { id: DelimiterWeight; label: string }[] = [
	{ id: "xs", label: "極 細" },
	{ id: "sm", label: "細 い" },
	{ id: "md", label: "普 通" },
	{ id: "xl", label: "太 い" },
];
const delimiterColor: { id: DelimiterColor; label: string }[] = [
	{ id: "gray", label: "グレー" },
	{ id: "pink", label: "ピンク" },
	{ id: "green", label: "グリーン" },
	{ id: "orange", label: "オレンジ" },
	{ id: "blue", label: "ブルー" },
];

const sanitize = {}; // ｂlｃｋDataの内、プロパティtextをsanitaizeする。<br/>タグは許可する

const DelimiterInner = ({ type, weight, color, className }: DataType) => {
	if (type === "dashed") {
		return <Divider w="100%" my="sm" size={weight} color={cArr[color][3]} variant="dashed" />;
	} else if (type === "stars") {
		return (
			<Box className={className} w="100%" my="0.5em">
				<BorderStarSVG height="1em" />
			</Box>
		);
	} else if (type === "handLine") {
		return (
			<Box className={className} w="100%" my="0.5em">
				<BorderHandLineSVG height="1em" />
			</Box>
		);
	} else if (type === "birdTracks") {
		return (
			<Box className={className} w="100%" my="0.5em">
				<BorderTrickSVG height="1em" color={cArr[color][8]} />
			</Box>
		);
	} else if (type === "threePoints") {
		return (
			<Box className={className} w="100%" my="0.5em">
				<ThreePointsSVG height="1em" color={cArr[color][8]} />
			</Box>
		);
	} else {
		return <Divider className={className} w="100%" my="sm" size={weight} color={cArr[color][3]} />;
	}
};

export const DelimiterTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	// const nData = api.mergeBlockData({ defaultData: blockTool.defaultData, newData: blockData.data }) as DataType;
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;
	const className = `${api.p1_globalClassName.block} ${api.p1_globalClassName.blockContent} ${blockTool.className}`;

	const getAlign = (align: string) => {
		if (align === "right") {
			return "flex-end";
		} else if (align === "center") {
			return "center";
		} else {
			return "flex-start";
		}
	};
	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={DelimiterToolTuneMenu} api={api}>
			<Flex justify={getAlign(blockData.data?.align)} my="0.4em">
				<DelimiterInner type={nData.type} weight={nData.weight} color={nData.color} className={className} />
			</Flex>
		</P1_EditorWrapper>
	);
};

const DelimiterToolTuneMenu = ({ id, blockData, api }: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//
	return (
		<>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>スタイル</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{delimiterStyle.map((type) => (
						<ExMenuChild
							key={type.id}
							active={type.id === blockData.data.type}
							onClick={() => {
								api.handleAddBlockData({ id: blockData.id, data: { type: type.id } });
							}}
						>
							<Text>{type.label}</Text>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>太 さ</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{delimiterWeight.map((weight) => (
						<ExMenuChild
							key={weight.id}
							active={weight.id === blockData.data.weight}
							onClick={() => {
								api.handleAddBlockData({ id: blockData.id, data: { weight: weight.id } });
							}}
						>
							<Text>{weight.label}</Text>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>色</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{delimiterColor.map((color) => (
						<ExMenuChild
							key={color.id}
							active={color.id === blockData.data.color}
							onClick={() => {
								api.handleAddBlockData({ id: blockData.id, data: { color: color.id } });
							}}
						>
							<Text sx={{ color: cArr[color.id][6] }}>{color.label}</Text>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
		</>
	);
};

export const BorderHandLineSVG = ({ width = "100%", height = "100%", color = "#c11165", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 111.3 8.04" color={color}>
			<title>BorderHandLineSVG</title>
			<path
				d="M.02,7.47c2.04-.06,3.55-.13,4.84-.31,1.21-.17,3.66-1.02,4.5-1.97s.75-3.05-.35-3.64c-1.04-.56-2.4,.46-2.52,1.71s.99,3.15,2.04,3.71,3.43,.61,4.6,.53c3.91-.26,7.07-1.93,7.89-4.28,.4-1.13-.87-1.74-2.27-1.22-1.5,.56-2.52,2.82-1.52,4.04,1.93,2.37,11.25-.65,12.56-2.51s-.54-3.08-2.29-1.09-.06,2.88,.6,3.42,1.51,.7,2.33,.85c1.84,.32,3.74,.65,5.56,.2s2.8-3.59,2.85-4.93-3.34,.4-2.6,2.33c.61,1.6,5.39,2.13,8.82,1.6,.96-.15,1.97-.38,2.67-1.1s.9-2.1,.16-2.77c-1.07-.98-2.81,.65-2.51,2.13s1.75,2.34,3.12,2.66c3.24,.77,10.44-1.91,11.11-3.11,1.28-2.3-1.36-3.12-2.59-1.26-.52,.79-.34,3.09,.37,3.68s2.36,.61,3.25,.66c3.99,.22,9.64-2.85,9.9-4.38s-6.06-1.46-4.6,1.73c.51,1.11,3.87,3.18,7.65,2.75s8.12-3.41,8.39-4.5c.36-1.46-2.92-.85-3.32,.35s.37,2.56,1.43,3.14,2.3,.54,3.48,.41c4.44-.49,8.86-3.32,9-4.65s-2.57-.61-3.52,.29-1.19,2.06-.65,3.3c.69,1.6,2.32,1.91,3.96,1.86,1.95-.06,5.84-.75,7.39-1.3,1.84-.65,3.48-1.77,4.15-3.02,1.24-2.31-2.39-3.05-3.55-1.09s1.73,5.89,6.02,5.68c1.79-.09,3.36-.32,4.64-1.18"
				fill="none"
				stroke={color}
				strokeMiterlimit={10}
				strokeWidth="1"
			/>
		</svg>
	);
};

export const BorderStarSVG = ({ width = "100%", height = "100%", color = "rgb(84,85,84)", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 112 9">
			<title>BorderStarSVG</title>
			<path
				d="M5.686,4.647C3.809,5.194,3.671,6.1,2.677,8.742,1.987,6.147,1.877,5.5,0,4.67,1.9,4,2.291,2.361,2.677.456,3.257,2.551,3.781,4.218,5.686,4.647Z"
				fill="#ce841e"
				strokeWidth={0}
			/>
			<path
				d="M112,4.647c-1.877.547-2.015,1.452-3.008,4.095-.69-2.595-.8-3.238-2.678-4.072,1.9-.666,2.291-2.309,2.678-4.214C109.571,2.551,110.1,4.218,112,4.647Z"
				fill="#ce841e"
				strokeWidth={0}
			/>
			<path
				d="M14.907,0c-.465,1.542-.306,3.858-2.924,4.249,1.939.782,2.2,2.253,2.872,4.628.775-2.417,1.084-3.938,2.635-4.251C15.066,3.922,15.488,1.564,14.907,0Z"
				fill="#971525"
				strokeWidth={0}
			/>
			<path
				d="M97.12,0c-.465,1.542-.306,3.858-2.923,4.249,1.938.782,2.2,2.253,2.871,4.628.775-2.417,1.084-3.938,2.635-4.251C97.28,3.922,97.7,1.564,97.12,0Z"
				fill="#971525"
				strokeWidth={0}
			/>
			<path
				d="M26.452.145c-.563,2.034-.973,4.2-2.664,4.421,1.588.8,2.408,1.724,2.921,4.42.512-2.74,1.281-4.067,2.715-4.42C27.887,4.08,26.965,2.223,26.452.145Z"
				fill="#fbbe40"
				strokeWidth={0}
			/>
			<path
				d="M61.657.145c-.564,2.034-.974,4.2-2.665,4.421,1.589.8,2.409,1.724,2.921,4.42.512-2.74,1.281-4.067,2.716-4.42C63.092,4.08,62.169,2.223,61.657.145Z"
				fill="#fbbe40"
				strokeWidth={0}
			/>
			<path
				d="M38.333.061c-.282,1.92-.456,3.493-2.611,4.359,1.638.464,2.355,2.572,2.867,4.58.445-1.973,1.146-4.107,2.619-4.437C39.9,3.989,38.889,1.724,38.333.061Z"
				fill="#5f0e25"
				strokeWidth={0}
			/>
			<path
				d="M85.024.061c-.281,1.92-.456,3.493-2.611,4.359,1.638.464,2.355,2.572,2.867,4.58.445-1.973,1.146-4.107,2.619-4.437C86.594,3.989,85.58,1.724,85.024.061Z"
				fill="#5f0e25"
				strokeWidth={0}
			/>
			<path
				d="M50.085.172c-.3,1.426-.927,4.01-2.579,4.319,1.542.57,2.193,2.492,2.606,4.345C50.388,6.983,51.3,4.743,52.694,4.3,51.094,4.075,50.553,1.5,50.085.172Z"
				fill="#e8981e"
				strokeWidth={0}
			/>
			<path
				d="M73.506.172c-.3,1.426-.927,4.01-2.579,4.319,1.542.57,2.193,2.492,2.606,4.345.276-1.853,1.191-4.093,2.582-4.535C74.515,4.075,73.974,1.5,73.506.172Z"
				fill="#e8981e"
				strokeWidth={0}
			/>
		</svg>
	);
};

export const BorderTrickSVG = ({ width = "100%", height = "100%", color = "#222", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 56.21 7.8" color={color}>
			<title>BorderTrickSVG</title>

			<g fill="none" stroke={color} strokeMiterlimit={10} strokeWidth="1.5">
				<polyline points=".39 1.6 3.91 5.62 7.66 1.54" />
				<line x1="3.92" y1="0" x2="3.84" y2="7.74" />

				<polyline points="24.76 1.81 28.07 5.48 32.13 1.54" />
				<line x1="28.15" y1=".15" x2="27.99" y2="7.47" />

				<polyline points="49.24 1.79 52.36 5.54 55.8 1.34" />
				<line x1="52.3" y1=".09" x2="52.42" y2="7.79" />
			</g>
		</svg>
	);
};

export const ThreePointsSVG = ({ width = "100%", height = "100%", color = "#222", rotate = "0" }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 56.21 7.8" color={color}>
			<title>ThreePointsSVG</title>

			<g fill={color} stroke="none">
				<circle cx="2.58" cy="2.58" r="2.58" />
				<circle cx="27.68" cy="2.58" r="2.58" />
				<circle cx="52.77" cy="2.58" r="2.58" />
			</g>
		</svg>
	);
};
