import { ReactNode, useEffect, useState } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";

import { Box, Flex, Tooltip, ActionIcon, Menu, NavLink, Divider, Text, Affix } from "@mantine/core";

import { BlockControlType, OutputBlockData } from "./p1_EditorTypes";

import { useClickOutside } from "@mantine/hooks";
import { DefaultBlockTuneMenu } from "./plugin/blockTunes/defaultBlockTune";
import { FloatingPosition } from "@mantine/core/lib/Floating";
import { config } from "./p1_EditorConfig";
import { c, cArr } from "../../../styles/eStyle";

type EditorWrapperType = {
	blockData: OutputBlockData;
	BlockTuneMenu: ({
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
		// <Tooltip label={labelStr} position="top" withArrow styles={{ tooltip: { fontSize: 10 } }}>
		<Box
			// onMouseEnter={() => {
			// 	setIsHovered(true);
			// }}
			// onMouseLeave={() => {
			// 	setIsHovered(false);
			// }}
			sx={{
				backgroundColor: api.viewGrid ? markerColor : null,
			}}
		>
			{children}
		</Box>
		// </Tooltip>
	);
};
export const P1_EditorWrapper = ({ blockData, BlockTuneMenu, api, children, ...props }: EditorWrapperType) => {
	//
	// const [isHovered, setIsHovered] = useState(false);

	const { blockTools, addNewBlock }: BlockControlType = api;
	const [menuName, setMenuName] = useState<null | "add" | "tune">(null);
	const [menuPosition, setMenuPosition] = useState<FloatingPosition>("bottom-start");

	// const displayMenu = () => {
	// 	if (api.readOnly || api.viewGrid) {
	// 		return false;
	// 	} else if (isHovered) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// };

	const ref = useClickOutside(() => setMenuName(null));

	return (
		<MarkerColorWrapper api={api} blockData={blockData}>
			<Box
				{...props}
				fz="16px"
				// onMouseEnter={() => {
				// 	setIsHovered(true);
				// }}
				// onMouseLeave={() => {
				// 	setIsHovered(false);
				// }}
			>
				<Menu
					// opened={displayMenu()}
					trigger="hover"
					// opened={true}
					position="left-start"
					openDelay={0}
					closeDelay={0}
					offset={-32}
					styles={{ dropdown: { border: "none", padding: 0 } }}
					zIndex={1}
				>
					<Menu.Target>
						<Box px="2em" sx={{ zIndex: 10000 }}>
							{children}
						</Box>
					</Menu.Target>
					<Menu.Dropdown sx={{ zIndex: 0 }}>
						<Menu
							shadow="md"
							width={200}
							position={menuPosition}
							opened={Boolean(menuName)}
							// opened={true}
							offset={0}
							onPositionChange={(e) => {
								setMenuPosition(e);
							}}
							// trigger="hover"
						>
							<Menu.Target>
								<Flex>
									<ActionIcon>
										<Tooltip label="追加">
											<AddIcon
												onClick={() => {
													setMenuName(menuName ? null : "add");
												}}
											/>
										</Tooltip>
									</ActionIcon>
									<ActionIcon>
										<Tooltip label="メニュー">
											<DragIndicatorIcon
												onClick={() => {
													setMenuName(menuName ? null : "tune");
												}}
											/>
										</Tooltip>
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
						</Menu>
					</Menu.Dropdown>
				</Menu>
			</Box>
		</MarkerColorWrapper>
	);
};
