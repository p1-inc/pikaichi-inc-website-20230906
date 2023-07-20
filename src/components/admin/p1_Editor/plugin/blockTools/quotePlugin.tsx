import { Box, Button, Flex, Menu, NavLink, Text } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";
import { c, cArr } from "../../../../../styles/eStyle";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties } from "react";
import { P1_ContentEditableComp } from "../../p1_ContentEditableComp";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";

import { IconRectangleFilled } from "@tabler/icons-react";

const sanitize = { text: { br: true } }; // ｂlｃｋDataの内、プロパティtextをsanitaizeする。<br/>タグは許可する

type QuoteBCType = "skyblue" | "yellow" | "pink" | "green" | "beige" | "gray";

const quoteBCStyle: { id: QuoteBCType; colorCode: string; label: string }[] = [
	{ id: "skyblue", colorCode: cArr.blue[1], label: "ブルー" },
	{ id: "yellow", colorCode: cArr.yellow[1], label: "イエロー" },
	{ id: "pink", colorCode: cArr.pink[1], label: "ピンク" },
	{ id: "green", colorCode: cArr.green[1], label: "グリーン" },
	{ id: "beige", colorCode: cArr.yelloworange[1], label: "ベージュ" },
	{ id: "gray", colorCode: cArr.gray[1], label: "グレー" },
];

export const QuoteTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	type DataType = {
		align: CSSProperties["textAlign"];
		bcColor: keyof typeof cArr;
		text: string;
	};

	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;

	const pureBlockText = api.getPureBlockData(nData.text);
	const pureBlockData = { ...nData, text: pureBlockText };

	const textAlign = nData?.align || "left";
	const getMargin = (textAlign: string) => {
		if (textAlign === "right") {
			return "0 0 0 auto";
		} else if (textAlign === "center") {
			return " 0 auto";
		} else {
			return "0";
		}
	};

	const _bgColor = quoteBCStyle.find((d) => d.id === nData.bcColor);
	const bgColor = _bgColor ? _bgColor.colorCode : null;

	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={QuoteToolTuneMenu} api={api} mb="2em">
			<P1_ContentEditableComp
				blockData={blockData}
				blockTool={blockTool}
				api={api}
				pureBlockData={pureBlockData}
				/////
				component="blockquote"
				m={getMargin(textAlign)}
				my="0.4em"
				w="fit-content"
				p="0.6em"
				sx={{ backgroundColor: bgColor, border: "none", borderRadius: "0.3em", boxShadow: "none" }}
			/>
		</P1_EditorWrapper>
	);
};

const QuoteToolTuneMenu = ({
	id,
	blockData,
	api,
}: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//

	return (
		<>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>背景色</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{quoteBCStyle.map((color) => (
						<ExMenuChild
							key={color.id}
							onClick={() => {
								api.handleAddBlockData({ id: blockData.id, data: { bcColor: color.id } });
							}}
						>
							<Flex gap="0.7em" sx={{ color: color.colorCode }}>
								<IconRectangleFilled />
								<Text color={c.mainBlack}>{color.label}</Text>
							</Flex>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
		</>
	);
};
