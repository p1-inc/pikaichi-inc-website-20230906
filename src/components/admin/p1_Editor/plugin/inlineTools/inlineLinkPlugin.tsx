import { Box, Flex, NavLink, NumberInput, Text, TextInput, Tooltip } from "@mantine/core";
import { BlockControlType, InlineToolType } from "../../p1_EditorTypes";
import { cArr } from "../../../../../styles/eStyle";

import { ActionIcon } from "@mantine/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";

import { useEffect, useState } from "react";

export const InlineLinkSubPalette = ({
	tool,
	api,
	isActive,
	defaultValue,
}: { tool: InlineToolType; api: BlockControlType; isActive: boolean; defaultValue: string }) => {
	//
	const [value, setValue] = useState<string>();

	const handleSubmit = ({ tool, api, href, isActive }: { tool: InlineToolType; api: BlockControlType; href: string; isActive: boolean }) => {
		//
		const { inlineSel, submitInlineTune, updateInlineClassName, hideInlineSel } = api;

		const beforeClassNames = [tool.className];

		if (!inlineSel) {
			return;
		}

		console.log("isActive: ", isActive);
		if (isActive) {
			updateInlineClassName({ inlineSel, beforeClassNames });
			return;
		}

		const element = document.createElement("a");
		element.href = href;
		element.classList.add(beforeClassNames[0]);

		submitInlineTune({ inlineSel, element });
		hideInlineSel();
	};
	useEffect(() => {
		console.log("isActive: ", isActive);
	}, [isActive]);
	return (
		<Flex align="center" gap={0}>
			<TextInput
				size="xs"
				pr={0}
				placeholder="https://"
				defaultValue={defaultValue}
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
		return isHref ? isHref : [];
	});

	const defaultValue = wrapperEls[0];

	setInlineSubPalette({
		name: tool.id,
		component: <InlineLinkSubPalette tool={tool} api={api} isActive={isActive} defaultValue={defaultValue} />,
	});
};
