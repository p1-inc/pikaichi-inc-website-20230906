import { Box, Divider, Flex, NavLink, NumberInput, Text, Button, Space, Menu } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { c, cArr } from "../../../../../styles/eStyle";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { ExMenuParent } from "../../../../UILib/extendMantine";

type DataType = { height: number };

const sanitize = {}; // ｂlｃｋDataの内、プロパティtextをsanitaizeする。<br/>タグは許可する

export const SpaceTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;
	// const nData = api.mergeBlockData({ defaultData: blockTool.defaultData, newData: blockData.data }) as DataType;

	const { readOnly }: BlockControlType = api;

	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={SpaceToolTuneMenu} api={api}>
			<Flex
				className={`${api.p1_globalClassName.block} ${api.p1_globalClassName.blockContent} ${blockTool.className}
				`}
				my="0.4em"
			>
				<Space h={`${nData.height}em`} />
			</Flex>
		</P1_EditorWrapper>
	);
};

const SpaceToolTuneMenu = ({ id, blockData, api }: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//
	return (
		<>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>高 さ</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					<Flex align="flex-end">
						<NumberInput
							w="8em"
							size="xs"
							defaultValue={blockData.data?.height || 2}
							onChange={(val) => {
								api.handleAddBlockData({ id: id, data: { height: val } });
							}}
							min={0}
							max={10}
							precision={1}
							step={0.5}
						/>
					</Flex>
				</Menu.Dropdown>
			</Menu>

			{/* <NavLink label="高 さ" childrenOffset="xs">
				<Flex align="flex-end">
					<NumberInput
						w="8em"
						size="xs"
						defaultValue={blockData.data?.height || 2}
						onChange={(val) => {
							api.handleAddBlockData({ id: id, data: { height: val } });
						}}
						min={0}
						max={10}
					/>
					<Text ml="0.5em">em</Text>
				</Flex>
			</NavLink> */}
		</>
	);
};
