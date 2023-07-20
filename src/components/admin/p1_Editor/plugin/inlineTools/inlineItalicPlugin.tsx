import { BlockControlType, OutputBlockData, InitialToolPropsType, InlineToolType } from "../../p1_EditorTypes";

import { autoID } from "../../../../../util/autoID";

export const handleToInlineItalic = (tool: InlineToolType, api: BlockControlType, isActive: boolean) => {
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

	const element = document.createElement("i");
	element.classList.add(beforeClassNames[0]);

	submitInlineTune({ inlineSel, element });
};
