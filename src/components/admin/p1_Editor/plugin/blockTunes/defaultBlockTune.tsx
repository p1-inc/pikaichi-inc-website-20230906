import { Box, Divider, Flex, Menu, NavLink, Text } from "@mantine/core";

import { BlockControlType, OutputBlockData } from "../../p1_EditorTypes";
import { useState } from "react";
import { c, cArr } from "../../../../../styles/eStyle";

import { IconAlignCenter, IconAlignRight, IconCopy, IconAlignLeft, IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";
import { config } from "../../p1_EditorConfig";

type DefaultBlockTuneMenuType = {
	blockData: OutputBlockData;
	api: BlockControlType;
};

export const DefaultBlockTuneMenu = ({ blockData, api }: DefaultBlockTuneMenuType) => {
	//
	const textAlign: { id: "left" | "center" | "right"; label: string; icon: JSX.Element }[] = [
		{ id: "left", label: "左寄せ", icon: <IconAlignLeft /> },
		{ id: "center", label: "センター", icon: <IconAlignCenter /> },
		{ id: "right", label: "右寄せ", icon: <IconAlignRight /> },
	];

	const { handleAlignChange, reorderBlock, handleTuneBlocks, duplicateBlock }: BlockControlType = api;

	const [confirm, setConfirm] = useState<boolean>(false); //delete時、一度確認する

	const _blockTuneList1 = config.tuneBlocksList.find((d) => d.includes(blockData.type));
	const _blockTuneList2 = _blockTuneList1?.filter((d) => d !== blockData.type);
	const blockTuneList = _blockTuneList2?.map((d) => config.blockTools.find((d2) => d2.id === d));

	return (
		<Flex direction="column">
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>整 列</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{textAlign.map((align) => (
						<ExMenuChild
							key={align.id}
							active={align.id === blockData.data.align}
							onClick={() => {
								handleAlignChange(blockData.id, align.id);
							}}
						>
							<Flex align="center">
								<Box w="3em">{align.icon}</Box>
								{align.label}
							</Flex>
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>

			<Divider my="xs" size="xs" />

			{blockTuneList && blockTuneList.length !== 0 && (
				<>
					<Menu width={200} shadow="md" position="right-start" offset={0}>
						<Menu.Target>
							<Box>
								<ExMenuParent>ブロックの変更</ExMenuParent>
							</Box>
						</Menu.Target>
						<Menu.Dropdown>
							{blockTuneList.map((tool) => (
								<NavLink
									key={tool.id}
									label={tool.label}
									icon={tool.icon}
									onClick={() => {
										handleTuneBlocks({ beforeBlockId: blockData.id, afterBlockType: tool.id });
									}}
								/>
							))}
						</Menu.Dropdown>
					</Menu>
					<Divider my="xs" size="xs" />
				</>
			)}

			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<ExMenuChild
					onClick={() => {
						reorderBlock({ id: blockData.id, dir: "up" });
					}}
				>
					<IconChevronUp width="1em" />
					<Text ml="1em">上へ移動</Text>
				</ExMenuChild>
			</Menu>

			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<ExMenuChild
					onClick={() => {
						reorderBlock({ id: blockData.id, dir: "down" });
					}}
				>
					<IconChevronDown width="1em" />
					<Text ml="1em">下へ移動</Text>
				</ExMenuChild>
			</Menu>

			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<ExMenuChild
					onClick={() => {
						duplicateBlock({ id: blockData.id });
					}}
				>
					<IconCopy width="1em" />
					<Text ml="1em">複 製</Text>
				</ExMenuChild>
			</Menu>

			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<ExMenuChild
					sx={{
						borderRadius: "0.3em",
						backgroundColor: confirm ? cArr.pink[4] : "inherit",
						color: confirm ? "#FFF" : "inherit",
						"&:hover": {
							backgroundColor: confirm ? cArr.pink[5] : cArr.pink[0],
							color: confirm ? "#FFF" : c.mainBlack,
						},
					}}
					onClick={() => {
						if (confirm) {
							reorderBlock({ id: blockData.id, dir: "del" });
							setConfirm(false);
						} else {
							setConfirm(true);
						}
					}}
				>
					<IconX color={confirm ? "#FFF" : c.mainBlack} width="1em" />
					<Text ml="1em" sx={{ color: confirm ? "#FFF" : "inherit" }}>
						{confirm ? "クリックして削除" : "削 除"}
					</Text>
				</ExMenuChild>
			</Menu>
		</Flex>
	);
};
