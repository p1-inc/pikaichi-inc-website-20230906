import { Box, Button, Divider, Flex, Menu, NavLink, NumberInput, Text, Title, TitleOrder } from "@mantine/core";
import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconHeading } from "@codexteam/icons";
import { c, cArr } from "../../../../../styles/eStyle";

import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties, ReactNode } from "react";
import { P1_ContentEditableComp } from "../../p1_ContentEditableComp";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";

import CircleIcon from "@mui/icons-material/Circle";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const colorStyle: { id: string; colorCode: string; label: string }[] = [
	{ id: "none", colorCode: null, label: "なし" },
	{ id: "pink", colorCode: cArr.pink[5], label: "ピンク" },
	{ id: "orange", colorCode: cArr.orange[5], label: "オレンジ" },
	{ id: "yelloworange", colorCode: cArr.yelloworange[6], label: "イエロー" },
	{ id: "green", colorCode: cArr.green[5], label: "グリーン" },
	{ id: "skyblue", colorCode: cArr.skyblue[5], label: "ブルー" },
	{ id: "purple", colorCode: cArr.purple[5], label: "パープル" },
];

const headerStyles = [
	{ id: "none", label: "なし" },
	{ id: "headCell", label: "ヘッドセル" },
	{ id: "filled", label: "塗りつぶし" },
	{ id: "outlined", label: "囲み" },
];

const headerLevels: {
	number: TitleOrder;
	fz: number; //em
	label: string;
	tag: string;
	icon: string;
}[] = [
	{
		number: 2,
		fz: 1.625,
		label: "見出し大",
		tag: "H2",
		icon: IconH2,
	},
	{
		number: 3,
		fz: 1.41,
		label: "見出し中",
		tag: "H3",
		icon: IconH3,
	},
	{
		number: 4,
		fz: 1.12,
		label: "見出し小1",
		tag: "H4",
		icon: IconH4,
	},
	{
		number: 5,
		fz: 1,
		label: "見出し小2",
		tag: "H5",
		icon: IconH4,
	},
	{
		number: 6,
		fz: 0.8,
		label: "見出し小3",
		tag: "H6",
		icon: IconH4,
	},
];

const fz = (level: TitleOrder) => {
	let result;

	switch (level) {
		case 1:
			result = 2;
			break;
		case 2:
			result = 1.5;
			break;
		case 3:
			result = 1.17;
			break;
		case 4:
			result = 1;
			break;
		case 5:
			result = 0.83;
			break;
		case 6:
			result = 0.67;
			break;
		default:
			break;
	}
	return result;
};

const HeaderWrapper = ({ blockData, headerLevel, children }: { blockData: DataType; headerLevel: TitleOrder; children: ReactNode }) => {
	const { style, color } = blockData;
	const borderWeight = Math.max(fz(headerLevel) * 2, 1);
	return (
		<>
			{style === "none" && <Box sx={{ color: color }}>{children}</Box>}
			{style === "headCell" && (
				<Flex w="100%" gap={fz(headerLevel) * 8}>
					<Box w={fz(headerLevel) * 7} sx={{ aspectRatio: "1/3", backgroundColor: color }} />
					{children}
				</Flex>
			)}
			{style === "filled" && (
				<Box px="1em" py="0.8em" sx={{ backgroundColor: color, color: "#FFF", borderRadius: "0.5em" }}>
					{children}
				</Box>
			)}
			{style === "outlined" && (
				<Box px="1em" py="0.8em" sx={{ color: color, border: `${borderWeight}px solid ${color}`, borderRadius: "0.5em" }}>
					{children}
				</Box>
			)}
		</>
	);
};

type DataType = {
	align: CSSProperties["textAlign"];
	lineHeight: number;
	text: string;
	level: number;
	style: string;
	color: string;
};

export const Header = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;

	const pureBlockText = api.getPureBlockData(nData.text);
	const pureBlockData = { ...nData, text: pureBlockText };

	const headerLevel = (Number(pureBlockData?.level) || 2) as TitleOrder;
	const headerStyle = headerLevels.find((d) => d.number === headerLevel);
	const textAlign = nData?.align || "left";

	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={HeaderBlockTuneMenu} api={api} mt="2em" mb="0.25em">
			<Box w="100%">
				<HeaderWrapper headerLevel={headerLevel} blockData={pureBlockData}>
					<P1_ContentEditableComp
						blockData={blockData}
						blockTool={blockTool}
						api={api}
						pureBlockData={pureBlockData}
						/////
						component={Title}
						w="100%"
						ta={textAlign}
						order={headerLevel}
						weight="normal"
						fz={`${headerStyle.fz}em`}
						lh={1.6}
					/>
				</HeaderWrapper>
			</Box>
		</P1_EditorWrapper>
	);
};

const HeaderBlockTuneMenu = ({ id, blockData, api }: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//
	return (
		<>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>デザイン変換</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{headerStyles.map((style) => {
						return (
							<ExMenuChild
								key={style.id}
								active={style.id === blockData.data?.style}
								onClick={() => {
									api.handleAddBlockData({ id: id, data: { style: style.id } });
								}}
							>
								{style.label}
							</ExMenuChild>
						);
					})}
				</Menu.Dropdown>
			</Menu>

			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>見出し大きさ</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{headerLevels.map((level) => (
						<ExMenuChild
							key={level.tag}
							active={level.number === blockData.data?.level}
							onClick={() => {
								api.handleAddBlockData({ id: id, data: { level: level.number } });
							}}
						>
							{level.label}
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
							active={color.colorCode === blockData.data?.color}
							onClick={() => {
								api.handleAddBlockData({ id: id, data: { color: color.colorCode } });
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
