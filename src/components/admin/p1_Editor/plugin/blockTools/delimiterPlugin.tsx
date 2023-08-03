import { Box, Divider, Flex, NavLink, NumberInput, Text, Button, Menu } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { c, cArr } from "../../../../../styles/eStyle";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { BorderStarSVG } from "../../../../../svg/BorderStarSVG";
import { BorderHandLineSVG } from "../../../../../svg/BorderHandLineSVG";
import { CSSProperties } from "react";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";

type DelimiterType = "solid" | "dashed" | "stars" | "handLine";
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
	console.log("blockData: ", blockData);
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
