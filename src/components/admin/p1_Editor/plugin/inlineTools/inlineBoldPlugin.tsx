import { Box, Flex, NavLink, NumberInput, Text } from "@mantine/core";
import { BlockControlType, InlineToolType } from "../../p1_EditorTypes";

export const handleToInlineBold = (tool: InlineToolType, api: BlockControlType, isActive: boolean) => {
	//
	const { inlineSel, submitInlineTune, updateInlineClassName } = api;

	const beforeClassNames = [tool.className];

	if (!inlineSel) {
		return;
	}

	if (isActive) {
		updateInlineClassName({ inlineSel, beforeClassNames });
		return;
	}

	const element = document.createElement("b");
	element.classList.add(beforeClassNames[0]);

	submitInlineTune({ inlineSel, element });
};
