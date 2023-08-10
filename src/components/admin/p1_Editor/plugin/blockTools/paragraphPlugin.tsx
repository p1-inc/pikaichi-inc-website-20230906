import { Box, Flex, Menu, NavLink, NumberInput, Text } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties } from "react";
import { P1_ContentEditableComp } from "../../p1_ContentEditableComp";
import { ExMenuParent } from "../../../../UILib/extendMantine";

type DataType = {
	align: CSSProperties["textAlign"];
	lineHeight: number;
	text: string;
};

export const Paragraph = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;
	const pureBlockText = api.getPureBlockData(nData.text);

	const pureBlockData = { ...nData, text: pureBlockText };

	const textAlign = nData?.align || "left";

	return (
		<P1_EditorWrapper blockData={blockData} api={api} my="0.18em">
			<P1_ContentEditableComp
				blockData={blockData}
				blockTool={blockTool}
				api={api}
				pureBlockData={pureBlockData}
				/////
				component="p"
				// my="0.4em"

				fz="1em"
				w="100%"
				ta={textAlign}
				lh="1.6em"
			/>
		</P1_EditorWrapper>
	);
};

// const ParagraphBlockTuneMenu = ({ id, blockData, api }: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
// 	return (
// 		<>
// 			<Menu width={200} shadow="md" position="right-start" offset={0}>
// 				<Menu.Target>
// 					<Box>
// 						<ExMenuParent>行 間</ExMenuParent>
// 					</Box>
// 				</Menu.Target>
// 				<Menu.Dropdown>
// 					<Flex align="flex-end">
// 						<NumberInput
// 							w="8em"
// 							size="xs"
// 							defaultValue={blockData.data?.lineHeight || 2}
// 							onChange={(val) => {
// 								api.handleAddBlockData({ id: id, data: { lineHeight: Number(val) } });
// 							}}
// 							precision={2}
// 							step={0.25}
// 						/>
// 					</Flex>
// 				</Menu.Dropdown>
// 			</Menu>
// 		</>
// 	);
// };
