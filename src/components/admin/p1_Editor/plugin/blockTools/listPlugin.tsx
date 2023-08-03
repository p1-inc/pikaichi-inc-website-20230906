import { Flex, NavLink, NumberInput, Text, List, Box, Button, HoverCard, UnstyledButton, Menu } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties, useState } from "react";
import { P1_ContentEditableComp } from "../../p1_ContentEditableComp";

import { c, cArr } from "../../../../../styles/eStyle";

import { IconPointFilled, IconCircleFilled, IconPlayerStopFilled, IconPlayerPlayFilled, Icon123, IconBoxMultiple1 } from "@tabler/icons-react";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";
import CircleIcon from "@mui/icons-material/Circle";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

type DataType = {
	align: CSSProperties["textAlign"];
	style: string;
	text: string;
	color: string;
};

type listStylesType = {
	id: string;
	label: string;
	icon: JSX.Element;
};
export const listStyleConfig: listStylesType[] = [
	{ id: "disc", label: "点", icon: <IconPointFilled width="1em" /> },
	{ id: "decimal", label: "番 号", icon: <Icon123 /> },
	{ id: "squareDecimal", label: "囲み番号", icon: <IconBoxMultiple1 /> },
	{ id: "circle", label: "丸", icon: <IconCircleFilled width="1em" /> },
	{ id: "square", label: "四 角", icon: <IconPlayerStopFilled width="1em" /> },
	{ id: "triangle", label: "三 角", icon: <IconPlayerPlayFilled width="1em" /> },
];

const colorStyle: { id: string; colorCode: string; label: string }[] = [
	{ id: "none", colorCode: cArr.gray[8], label: "なし" },
	{ id: "pink", colorCode: cArr.pink[5], label: "ピンク" },
	{ id: "orange", colorCode: cArr.orange[5], label: "オレンジ" },
	{ id: "yelloworange", colorCode: cArr.yelloworange[6], label: "イエロー" },
	{ id: "green", colorCode: cArr.green[5], label: "グリーン" },
	{ id: "skyblue", colorCode: cArr.skyblue[5], label: "ブルー" },
	{ id: "purple", colorCode: cArr.purple[5], label: "パープル" },
];

const PreMark = ({ listIndex, listStyle, listColor }: { listIndex: number; listStyle: string; listColor: string }) => {
	//

	const _color = colorStyle.find((d) => d.id === listColor);
	const color = _color.colorCode;

	if (listStyle === "decimal") {
		return <Text my="0.4em">{listIndex}.</Text>;
	} else if (listStyle === "squareDecimal") {
		const textColor = listColor !== "none" ? "#FFF" : null;
		const borderColor = listColor !== "none" ? color : "#7e7e7e";
		const bgColor = listColor !== "none" ? color : null;

		return (
			<Flex
				my="0.7em"
				w="1.1em"
				h="1.1em"
				align="center"
				justify="center"
				// mt="0.3em"
				sx={{
					flexShrink: 0,
					color: textColor,
					backgroundColor: bgColor,
					border: `2px solid  ${borderColor}`,
					borderRadius: "0.2em",
				}}
			>
				<Text fw="bold" fz="0.8em" mb={1}>
					{listIndex + 1}
				</Text>
			</Flex>
		);
	} else {
		return (
			<Flex mt="0.5em" align="center" sx={{ color: color }}>
				{listStyleConfig.find((d) => d.id === listStyle)?.icon}
			</Flex>
		);
	}
};

const groupIndexList = ({ id, blockDataArr }: { id: string; blockDataArr: OutputBlockData[] }) => {
	type ListType = {
		data: {
			align: string;
			color: string;
			style: string;
			text: string;
		};
		id: string;
		type: "list";
	};

	let isInnerList = false;
	const nListData1: ListType[][] = [];
	let tmpList: ListType[] = [];
	blockDataArr.forEach((data: ListType) => {
		if (data.type === "list") {
			isInnerList = true;
			tmpList.push(data);
		} else {
			isInnerList = false;
			if (tmpList.length !== 0) {
				nListData1.push(tmpList);
			}
			tmpList = [];
		}
	});
	if (tmpList.length !== 0) {
		nListData1.push(tmpList);
	}

	const changeList = nListData1.flatMap((arr) => {
		const isExist = arr.find((d) => d.id === id);
		if (isExist) {
			return arr;
		} else {
			return [];
		}
	});

	const commonStyles = changeList.map((d) => d.data.style);
	const commonColors = changeList.map((d) => d.data.color);

	const styleCounts = commonStyles.reduce((acc: { [id: string]: number }, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {});

	const colorCounts = commonColors.reduce((acc: { [id: string]: number }, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {});

	let mostFrequentStyle = null;
	let maxStyleCount = -1;
	for (const item in styleCounts) {
		if (styleCounts[item] > maxStyleCount) {
			maxStyleCount = styleCounts[item];
			mostFrequentStyle = item;
		}
	}

	let mostFrequentColor = null;
	let maxColorCount = -1;
	for (const item in colorCounts) {
		if (colorCounts[item] > maxColorCount) {
			maxColorCount = colorCounts[item];
			mostFrequentColor = item;
		}
	}
	let topOrBottom: "top" | "bottom" | "othors";
	const listIndex = changeList.findIndex((d) => d.id === id);

	if (listIndex === 0) {
		topOrBottom = "top";
	} else if (listIndex === changeList.length - 1) {
		topOrBottom = "bottom";
	} else {
		topOrBottom = "othors";
	}

	return { listIndex: listIndex, topOrBottom, changeList, listStyle: mostFrequentStyle, listColor: mostFrequentColor };
};

const handleChangeListStyle = ({ id, style, blockDataArr }: { id: string; style: string; blockDataArr: OutputBlockData[] }) => {
	const { changeList, listStyle, listColor } = groupIndexList({ id, blockDataArr });
	const changeIndexList = changeList.map((d) => d.id);
	const nBlockDataArr = blockDataArr.map((d) => {
		if (changeIndexList.includes(d.id)) {
			d.data = { ...d.data, style: style };
		}
		return d;
	});
	return nBlockDataArr;
};

const handleChangeListColor = ({ id, color, blockDataArr }: { id: string; color: string; blockDataArr: OutputBlockData[] }) => {
	const { changeList, listStyle, listColor } = groupIndexList({ id, blockDataArr });
	const changeIndexList = changeList.map((d) => d.id);
	const nBlockDataArr = blockDataArr.map((d) => {
		if (changeIndexList.includes(d.id)) {
			d.data = { ...d.data, color: color };
		}
		return d;
	});
	return nBlockDataArr;
};

export const ListTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//

	const { listIndex, topOrBottom, listStyle, listColor } = groupIndexList({
		id: blockData.id,
		blockDataArr: api.blockDataArr,
	});

	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;
	const pureBlockText = api.getPureBlockData(nData.text);
	const pureBlockData = { ...nData, text: pureBlockText };

	const textAlign = nData?.align || "left";

	const getMargin = () => {
		if (topOrBottom === "top") {
			return {
				mt: "2em",
			};
		} else if (topOrBottom === "bottom") {
			return {
				mb: "2em",
			};
		}
	};

	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={ParagraphBlockTuneMenu} api={api}>
			<Flex gap="0.5em" align="flex-start" {...getMargin()}>
				<PreMark listIndex={listIndex} listStyle={listStyle} listColor={listColor} />
				<P1_ContentEditableComp
					blockData={blockData}
					blockTool={blockTool}
					api={api}
					pureBlockData={pureBlockData}
					/////
					component="p"
					my="0.4em"
					ta={textAlign}
					// lh={2}
				/>
			</Flex>
		</P1_EditorWrapper>
	);
};

const ParagraphBlockTuneMenu = ({ id, blockData, api }: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
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
					{listStyleConfig.map((list) => (
						<ExMenuChild
							key={list.id}
							active={list.id === blockData.data?.style}
							onClick={() => {
								const nBlockDataArr = handleChangeListStyle({ id, style: list.id, blockDataArr: api.blockDataArr });
								api.handleSetBlockDataArr({ blockDataArr: nBlockDataArr });
							}}
						>
							<Flex align="center">
								<Box w="3em">{list.icon}</Box>
								{list.label}
							</Flex>
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
					{colorStyle.map((color) => (
						<ExMenuChild
							key={color.id}
							active={color.id === blockData.data?.color}
							onClick={() => {
								const nBlockDataArr = handleChangeListColor({ id, color: color.id, blockDataArr: api.blockDataArr });
								api.handleSetBlockDataArr({ blockDataArr: nBlockDataArr });
							}}
						>
							<Flex gap="0.5em">
								{color.id === "none" ? <NotInterestedIcon sx={{ color: color.colorCode }} /> : <CircleIcon sx={{ color: color.colorCode }} />}
								<Flex align="center">{color.label}</Flex>
							</Flex>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
		</>
	);
};
