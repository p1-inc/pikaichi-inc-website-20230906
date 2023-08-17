import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";

import { Box, Flex, Tooltip, ActionIcon, Menu, NavLink, Divider, Text, Affix, createStyles } from "@mantine/core";

import { BlockControlType, OutputBlockData } from "./p1_EditorTypes";

import { useClickOutside } from "@mantine/hooks";
import { DefaultBlockTuneMenu } from "./plugin/blockTunes/defaultBlockTune";
import { FloatingPosition } from "@mantine/core/lib/Floating";
import { config } from "./p1_EditorConfig";
import { c, cArr } from "../../../styles/eStyle";

type EditorWrapperType = {
	blockData: OutputBlockData;
	BlockTuneMenu?: ({
		id,
		blockData,
		api,
	}: {
		id: string;
		blockData: OutputBlockData;
		api: BlockControlType;
	}) => JSX.Element;
	api: BlockControlType;
	children: ReactNode;
	[key: string]: any;
};

const MarkerColorWrapper = ({ api, blockData, children }: { api: BlockControlType; blockData: OutputBlockData; children: ReactNode }) => {
	// const [isHovered, setIsHovered] = useState(false);
	const toolConfig = config.blockTools.find((d) => d.id === blockData.type);
	const markerColor = toolConfig ? toolConfig.markerColor : cArr.gray[1];
	const labelStr = toolConfig.label;

	return (
		<>
			<Text fz="0.8em" color="#FFF" pos="absolute" right={5}>
				{labelStr}
			</Text>
			<Box
				sx={{
					backgroundColor: api.viewGrid ? markerColor : null,
				}}
			>
				{children}
			</Box>
		</>
	);
};

const useStyles = createStyles((theme) => ({
	dropdown: { border: "none", padding: 0, backgroundColor: "initial" },
}));

export const P1_EditorWrapper = ({ blockData, BlockTuneMenu, api, children, ...props }: EditorWrapperType) => {
	//
	const { blockTools, addNewBlock }: BlockControlType = api;
	const [menuName, setMenuName] = useState<null | "add" | "tune">(null);
	// const [menuPosition, setMenuPosition] = useState<FloatingPosition>("bottom-end");

	const [menuBtnPos, setMenuBtnPos] = useState<number>(0);
	const ref = useClickOutside(() => setMenuName(null));

	const contentRef = useRef(null);
	const MenuBtnHeight = 16;

	useLayoutEffect(() => {
		const blockContent = contentRef.current.querySelector(`.${api.p1_globalClassName.blockContent}`);
		const contentStyle = window.getComputedStyle(blockContent);
		const contentLineHeight = parseInt(contentStyle.lineHeight);
		const offsetY = contentLineHeight / 2 - MenuBtnHeight / 2;
		setMenuBtnPos(offsetY);
	}, [contentRef.current]);

	const { classes } = useStyles();
	return (
		<MarkerColorWrapper api={api} blockData={blockData}>
			<Box {...props} fz="16px">
				<Menu trigger="hover" position="left-start" openDelay={0} closeDelay={0} offset={-32} zIndex={1} classNames={classes}>
					<Menu.Target>
						<Box ref={contentRef} px="2em" sx={{ label: "content", zIndex: 10000 }}>
							{children}
						</Box>
					</Menu.Target>
					<Menu.Dropdown sx={{ zIndex: 0 }}>
						<Box
							component={Menu}
							shadow="md"
							width={200}
							h={MenuBtnHeight}
							position="bottom-end"
							opened={Boolean(menuName)}
							// opened={true}
							offset={0}
							// onPositionChange={(e) => {
							// 	setMenuPosition(e);
							// }}
							mt={menuBtnPos}
						>
							<Menu.Target>
								<Flex gap="0.3em" mr="0.3em">
									<ActionIcon w="1em" h="1em" miw="initial" mih="initial">
										<AddIcon
											onClick={() => {
												setMenuName(menuName ? null : "add");
											}}
										/>
									</ActionIcon>
									<ActionIcon w="1em" h="1em" miw="initial" mih="initial">
										<DragIndicatorIcon
											onClick={() => {
												setMenuName(menuName ? null : "tune");
											}}
										/>
									</ActionIcon>
								</Flex>
							</Menu.Target>
							<Menu.Dropdown>
								<Box ref={ref}>
									<Box display={menuName === "add" ? "block" : "none"}>
										{blockTools.map((tool) => (
											<NavLink
												key={tool.id}
												label={tool.label}
												icon={tool.icon}
												onClick={() => {
													addNewBlock({ id: blockData.id, blockTool: tool.id });
												}}
											/>
										))}
									</Box>
									<Box display={menuName === "tune" ? "block" : "none"}>
										{BlockTuneMenu && (
											<>
												<BlockTuneMenu id={blockData.id} blockData={blockData} api={api} />
												<Divider my="xs" size="xs" />
											</>
										)}
										<DefaultBlockTuneMenu blockData={blockData} api={api} />
									</Box>
								</Box>
							</Menu.Dropdown>
						</Box>
					</Menu.Dropdown>
				</Menu>
			</Box>
		</MarkerColorWrapper>
	);
};
