import { FC, useEffect, useState } from "react";
import { cArr } from "../../../styles/eStyle";

import { BlockControlType, InitialToolPropsType, OutputBlockData } from "./p1_EditorTypes";
import { IconMoodSad2 } from "@tabler/icons-react";

import { Box, Flex, Text, CSSObject, Global, UnstyledButton, Button } from "@mantine/core";
import { P1_EditorStyle } from "./p1_EditorStyle";
import { getHotkeyHandler } from "@mantine/hooks";
import { InlineTunes } from "./plugin/inlineTunes/inlineTunes";

//TODO ブロックもスタイルもコピペできるようにする
type EditorContainerType = {
	readOnly?: boolean;
	api: BlockControlType;
	maw: string;
};

export const P1_EditorContainer = ({ readOnly = false, api, maw = "40em" }: EditorContainerType) => {
	//
	useEffect(() => {
		if (readOnly || api.viewGrid) {
			api.setReadOnly(readOnly);
		}
	}, [readOnly]);

	useEffect(() => {
		document.body.addEventListener(
			"keydown",
			getHotkeyHandler([
				["mod+Z", (e) => api.handleUndo(), { preventDefault: true }],
				["mod+Y", (e) => api.handleRedo(), { preventDefault: true }],
				["mod+shift+Z", (e) => api.handleRedo(), { preventDefault: true }],
			]),
		);
	}, []);

	return (
		<Box ref={api.containerRef} mb="5em" maw={maw}>
			{!readOnly && <InlineTunes api={api} />}
			<Global styles={P1_EditorStyle({}) as CSSObject} />
			{api.blockDataArr.map((blockData) => {
				const blockTool = api.blockTools.find((d) => d.id === blockData.type);
				const Component: FC<InitialToolPropsType> = blockTool?.component;

				return (
					<Box pos="relative" key={blockData.id} id={blockData.id} className={api.p1_globalClassName.blockWrapper}>
						{Component && <Component blockData={blockData} blockTool={blockTool} api={api} />}
						{!Component && <NoComponent blockData={blockData} api={api} />}
					</Box>
				);
			})}
		</Box>
	);
};

const NoComponent = ({ blockData, api }: { blockData: OutputBlockData; api: BlockControlType }) => {
	const [confirm, setConfirm] = useState<boolean>(false);
	return (
		<UnstyledButton
			sx={{ "&:hover": { opacity: 0.7 } }}
			onClick={() => {
				setConfirm(!confirm);
			}}
		>
			<Flex ml="2em" w="fit-content" p="1em" align="center" justify="center" sx={{ backgroundColor: cArr.pink[1], borderRadius: "0.5em" }}>
				{confirm ? (
					<Flex align="center" justify="center" w="22em" h="6em">
						<IconMoodSad2 stroke={1} size="4em" color={cArr.pink[6]} />
						<Flex m="0.5em" direction="column">
							<Text color={cArr.pink[6]}>{blockData.type}</Text>
							<Text color={cArr.pink[6]}>ブロックが見つかりませんでした</Text>
						</Flex>
					</Flex>
				) : (
					<Flex align="center" justify="center" w="22em" h="6em">
						<IconMoodSad2 stroke={1} size="4em" color={cArr.pink[6]} />
						<Button
							w="10em"
							color="pink"
							onClick={() => {
								api.reorderBlock({ id: blockData.id, dir: "del" });
							}}
						>
							削 除
						</Button>
					</Flex>
				)}
			</Flex>
		</UnstyledButton>
	);
};
