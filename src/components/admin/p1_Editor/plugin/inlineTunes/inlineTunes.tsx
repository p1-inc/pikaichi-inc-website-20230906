import { ActionIcon, Box, Flex, Portal, Tooltip } from "@mantine/core";

import { BlockControlType } from "../../p1_EditorTypes";
import { cArr } from "../../../../../styles/eStyle";

import { IconCircleOff } from "@tabler/icons-react";
import { useElementSize } from "@mantine/hooks";

export const InlineTunes = ({ api }: { api: BlockControlType }) => {
	//
	const { containerRef, inlineSel, inlineTools, inlineSubPalette, handleDeleteInlineStyle, blockDataArr } = api;
	const { displayInlineTune, top, left } = inlineSel || {};
	const { ref, width, height } = useElementSize();
	const offSetPosition = -20 - height;

	return (
		<Portal target={containerRef.current}>
			<Flex
				ref={ref}
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
					transition: "top 0.2s",
				}}
			>
				<Flex gap="0.5em" sx={{ userSelect: "none" }}>
					{inlineTools.map((tool) => {
						const isActive = Boolean(inlineSel?.wrappedStyles?.find((d) => d.classNames.includes(tool.className)));
						// if (tool.id === "link") {
						// 	console.log("isActive: ", isActive);
						// 	console.log("inlineSel?.wrappedStyles: ", inlineSel?.wrappedStyles);
						// }
						let disabled = false;
						if (inlineSubPalette && inlineSubPalette.name !== tool.id) {
							disabled = true;
						}
						return (
							<Tooltip key={tool.id} label={tool.label}>
								<ActionIcon
									disabled={disabled}
									color={isActive ? cArr.skyblue[6] : undefined}
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
