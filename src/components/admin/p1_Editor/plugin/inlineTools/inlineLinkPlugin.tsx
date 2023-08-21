import { Box, Flex, NavLink, NumberInput, Text, TextInput, Tooltip } from "@mantine/core";
import { BlockControlType, InlineToolType } from "../../p1_EditorTypes";
import { cArr } from "../../../../../styles/eStyle";

import { ActionIcon } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";

import { useEffect, useState } from "react";

type InlineLinkSubPaletteType = {
	tool: InlineToolType;
	api: BlockControlType;
	isActive: boolean;
	wrapperEl: { href: string; wrapperEl: Element };
};

export const InlineLinkSubPalette = ({ tool, api, isActive, wrapperEl }: InlineLinkSubPaletteType) => {
	//
	const [value, setValue] = useState<string>();

	const handleSubmit = ({ tool, api, href, isActive }: { tool: InlineToolType; api: BlockControlType; href: string; isActive: boolean }) => {
		//
		const { inlineSel, submitInlineTune } = api;

		const beforeClassNames = [tool.className];

		if (!inlineSel) {
			return;
		}

		if (isActive) {
			wrapperEl.wrapperEl.setAttribute("href", href);
			return;
		}

		const element = document.createElement("a");
		element.href = href;
		element.classList.add(beforeClassNames[0]);

		submitInlineTune({ inlineSel, element });
	};

	return (
		<Flex align="center" gap={0}>
			<TextInput
				size="xs"
				pr={0}
				placeholder="https://"
				defaultValue={wrapperEl.href}
				onChange={(e) => {
					setValue(e.currentTarget.value);
				}}
			/>
			<Flex ml="0.5em">
				<Tooltip label="OK">
					<ActionIcon
						color={cArr.skyblue[3]}
						onClick={() => {
							handleSubmit({ tool, api, isActive, href: value });
							api.setInlineSubPalette(null);
						}}
					>
						<DoneIcon />
					</ActionIcon>
				</Tooltip>
				<Tooltip label="解除">
					<ActionIcon
						color={cArr.skyblue[3]}
						onClick={() => {
							handleSubmit({ tool, api, isActive, href: value });
							api.setInlineSubPalette(null);
						}}
					>
						<DeleteForeverIcon />
					</ActionIcon>
				</Tooltip>
			</Flex>
		</Flex>
	);
};

export const handleToInlineLink = (tool: InlineToolType, api: BlockControlType, isActive: boolean) => {
	//
	const { inlineSel, setInlineSubPalette } = api;

	if (!inlineSel) {
		return;
	}
	const contentId = inlineSel.contentEl.contentId;
	const contentEl = document.getElementById(contentId);

	const wrapperEls = inlineSel.wrappedStyles.flatMap((d) => {
		const wrapperEl = api.getElementFromParentUsingPath(contentEl, d.path) as HTMLElement;
		const isHref = wrapperEl.getAttribute("href");
		return isHref ? { href: isHref, wrapperEl: wrapperEl } : [];
	});

	setInlineSubPalette({
		name: tool.id,
		component: <InlineLinkSubPalette tool={tool} api={api} isActive={isActive} wrapperEl={wrapperEls[0]} />,
	});
};
