import { Box, Flex, NavLink, NumberInput, Text, TextInput, Tooltip } from "@mantine/core";
import { BlockControlType, InlineToolType } from "../../p1_EditorTypes";
import { c, cArr } from "../../../../../styles/eStyle";

import { ActionIcon } from "@mantine/core";
import CircleIcon from "@mui/icons-material/Circle";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

export const markerColorList = [
	{ label: "pink", value: cArr.pink[2] },
	{ label: "orange", value: cArr.orange[2] },
	{ label: "yellow", value: cArr.yellow[2] },
	{ label: "green", value: cArr.green[2] },
	{ label: "skyblue", value: cArr.skyblue[2] },
	{ label: "purple", value: cArr.purple[2] },
	{ label: "none", value: cArr.gray[8] },
];

export const MarkerSubPalette = ({
	tool,
	api,
	isActive,
}: { tool: InlineToolType; api: BlockControlType; isActive: boolean }) => {
	//

	const handleSubmit = ({
		tool,
		api,
		color,
		isActive,
	}: { tool: InlineToolType; api: BlockControlType; color: { label: string; value: string }; isActive: boolean }) => {
		//
		const { inlineSel, submitInlineTune, updateInlineClassName } = api;

		const afterClassName = `${tool.className}-color-${color.label}`;

		if (!inlineSel) {
			return;
		}

		if (isActive) {
			if (color.label === "none") {
				const beforeClassNames = [tool.className];
				updateInlineClassName({ inlineSel, beforeClassNames });
			} else {
				const beforeClassNames = markerColorList.map((color) => `${tool.className}-color-${color.label}`);
				updateInlineClassName({ inlineSel, beforeClassNames, afterClassName });
			}
			return;
		}

		const element = document.createElement("mark");
		element.classList.add(tool.className, afterClassName);

		submitInlineTune({ inlineSel, element });
	};

	return (
		<Flex align="center" gap={0}>
			{markerColorList.map((color) => {
				if (color.label === "none") {
					return (
						<ActionIcon
							key={color.label}
							onClick={() => {
								handleSubmit({ tool, api, isActive, color });
								api.setInlineSubPalette(null);
							}}
						>
							<NotInterestedIcon sx={{ color: color.value }} />
						</ActionIcon>
					);
				} else {
					return (
						<ActionIcon
							key={color.label}
							onClick={() => {
								handleSubmit({ tool, api, isActive, color });
								api.setInlineSubPalette(null);
							}}
						>
							<CircleIcon sx={{ color: color.value }} />
						</ActionIcon>
					);
				}
			})}
		</Flex>
	);
};

export const handleToMarker = (tool: InlineToolType, api: BlockControlType, isActive: boolean) => {
	//
	const { inlineSel, setInlineSubPalette } = api;

	if (!inlineSel) {
		return;
	}
	setInlineSubPalette({
		name: tool.id,
		component: <MarkerSubPalette tool={tool} api={api} isActive={isActive} />,
	});
};
