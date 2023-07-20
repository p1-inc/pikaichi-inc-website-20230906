import { ActionIcon, Box, Flex, Portal, Tooltip } from "@mantine/core";

import { BlockControlType, InlineSelType } from "../../p1_EditorTypes";
import { cArr } from "../../../../../styles/eStyle";

import { IconCircleOff } from "@tabler/icons-react";

// const isActiveColor = ({ className, inlineSel }: { className: string; inlineSel: InlineSelType }) => {
// 	if (!inlineSel || !inlineSel.childWrapper) {
// 		return false;
// 	}
//
// 	const _classNames = new Set(inlineSel.childWrapper.classNames);
// 	if (inlineSel?.wrapper?.className) {
// 		_classNames.add(inlineSel?.wrapper?.className);
// 	}
// 	const classNames = Array.from(_classNames);
// 	if (classNames.includes(className)) {
// 		return true;
// 	}
// 	return false;
// };

export const InlineTunes = ({ api }: { api: BlockControlType }) => {
	//
	const {
		containerRef,
		inlineSel,
		inlineTools,
		inlineSubPalette,
		handleDeleteInlineStyle,
		// handleDeleteInlineStyle2,
		blockDataArr,
	} = api;
	const { displayInlineTune, top, left } = inlineSel || {};

	const offSetPosition = 40;

	return (
		<Portal target={containerRef.current}>
			<Flex
				className="inlineTuneEl"
				contentEditable={false}
				direction="column"
				pos="absolute"
				top={top + offSetPosition}
				left={left}
				p="0.5em"
				sx={{
					display: displayInlineTune ? "flex" : "none",
					backgroundColor: "#FFF",
					border: `1px solid ${cArr.gray[5]}`,
					borderRadius: "0.2em",
					filter: "drop-shadow(3px 3px 3px rgba(0,0,0,0.3))",
					zIndex: 1,
				}}
			>
				<Flex gap="0.5em" sx={{ userSelect: "none" }}>
					{inlineTools.map((tool) => {
						// const isActive: boolean = tool.className === inlineSel?.wrapper?.className;
						const isActive = Boolean(inlineSel?.wrappedStyles?.find((d) => d.classNames.includes(tool.className)));
						let disabled = false;
						if (inlineSubPalette && inlineSubPalette.name !== tool.id) {
							disabled = true;
						}
						return (
							<Tooltip key={tool.id} label={tool.label}>
								<ActionIcon
									disabled={disabled}
									color={isActive ? cArr.skyblue[6] : undefined}
									// color={isActiveColor({ className: tool.className, inlineSel }) ? cArr.skyblue[6] : undefined}
									size="xs"
									onClick={() => {
										tool.handle(tool, api, isActive);
									}}
								>
									{tool.icon}
								</ActionIcon>
							</Tooltip>
						);
					})}
					<Tooltip label="スタイル削除">
						<ActionIcon
							size="xs"
							onClick={() => {
								// handleDeleteInlineStyle({ id: inlineSel.blockId, blockDataArr });
								handleDeleteInlineStyle({ inlineSel });
							}}
						>
							<IconCircleOff />
						</ActionIcon>
					</Tooltip>
				</Flex>

				{inlineSubPalette && <Box mt="0.5em">{inlineSubPalette.component}</Box>}
			</Flex>
		</Portal>
	);
};
