import { Box, Button, Flex, Menu, Text, TextInput } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties, useState } from "react";

import { cArr } from "../../../../../styles/eStyle";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";
import { SizeType } from "../../../tableSelectTrigger";

const sizeList: { id: string; label: string; retio: number }[] = [
	{ id: "xs", label: "サイズ[XS]", retio: 0.6 },
	{ id: "s", label: "サイズ[S]", retio: 0.7 },
	{ id: "m", label: "サイズ[M]", retio: 0.8 },
	{ id: "l", label: "サイズ[L]", retio: 0.9 },
	{ id: "xl", label: "サイズ[XL]", retio: 1 },
];

const getSize = (size: string) => {
	let result = 1;
	const res = sizeList.find((d) => d.id === size);
	if (res) {
		result = res.retio;
	}
	return result;
};

type DataType = {
	align: CSSProperties["textAlign"];
	src: string;
	size: SizeType;
};
type EmbedSelectTriggerType = { src: string; size: string; onEmbed: (src: string) => void };
const EmbedSelectTrigger = ({ src = "", size, onEmbed }: EmbedSelectTriggerType) => {
	//
	const [value, setValue] = useState(src);

	return (
		<>
			{src === "" ? (
				<Flex
					w="100%"
					h="20em"
					p="1em"
					gap="1em"
					direction="column"
					sx={{ backgroundColor: cArr.orange[0], borderRadius: "0.5em" }}
				>
					<Text>Youtubeの動画を埋め込みます</Text>
					<Flex gap="0.5em">
						<TextInput
							w="20em"
							size="xs"
							placeholder="動画リンクを貼り付ける"
							value={value}
							onChange={(event) => setValue(event.currentTarget.value)}
						/>
						<Button
							size="xs"
							onClick={() => {
								onEmbed(value);
							}}
						>
							埋め込み適用
						</Button>
					</Flex>
				</Flex>
			) : (
				<Box
					component="iframe"
					w={`${100 * getSize(size)}%`}
					sx={{ aspectRatio: "16/9" }}
					src={src}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				/>
			)}
		</>
	);
};

export const MovieTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;
	const { readOnly }: BlockControlType = api;

	let nSrc = "";
	const onEmbed = (src: string) => {
		if (!src) {
			return;
		}
		const youtubeA = src.match(/https:\/\/youtu.be\/(.+)/);
		const youtubeB = src.match(/^<iframe.+https:\/\/www.youtube.com\/embed\/(.{11}).*<\/iframe>$/);
		const youtubeC = src.match(/^https:\/\/www.youtube.com\/watch\?v=(.{11}).*/);

		if (youtubeA) {
			nSrc = `https://www.youtube.com/embed/${youtubeA[1]}`;
		} else if (youtubeB) {
			nSrc = `https://www.youtube.com/embed/${youtubeB[1]}`;
		} else if (youtubeC) {
			nSrc = `https://www.youtube.com/embed/${youtubeC[1]}`;
		} else {
			return;
		}
		api.handleAddBlockData({ id: blockData.id, data: { src: nSrc } });
	};

	const getAlign = (align: CSSProperties["textAlign"]) => {
		if (align === "right") {
			return "flex-end";
		} else if (align === "center") {
			return "center";
		} else {
			return "flex-start";
		}
	};
	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={MovieToolTuneMenu} api={api} mb="2em">
			<Flex
				className={`${api.p1_globalClassName.block} ${api.p1_globalClassName.blockContent} ${blockTool.className}
				`}
				justify={getAlign(nData.align)}
				my="0.4em"
			>
				<EmbedSelectTrigger src={nData.src} size={nData.size} onEmbed={onEmbed} />
			</Flex>
		</P1_EditorWrapper>
	);
};

const MovieToolTuneMenu = ({
	id,
	blockData,
	api,
}: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//
	const [value, setValue] = useState(blockData.data?.src);

	const isSameSize = (size: string) => {
		if ("size" in blockData.data && blockData.data.size === size) {
			return true;
		}
		return false;
	};

	const onSrcChange = (src: string) => {
		if (!src) {
			return;
		}
		api.handleAddBlockData({ id: blockData.id, data: { src: src } });
	};

	return (
		<>
			<Menu width={200} shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>サイズ</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					{sizeList.map((size) => (
						<ExMenuChild
							key={size.id}
							onClick={() => {
								api.handleAddBlockData({ id: id, data: { size: size.id } });
							}}
							sx={{ backgroundColor: isSameSize(size.id) ? cArr.yellow[1] : "initial" }}
						>
							{size.label}
							{isSameSize(size.id) && "*"}
						</ExMenuChild>
					))}
				</Menu.Dropdown>
			</Menu>
			<Menu shadow="md" position="right-start" offset={0}>
				<Menu.Target>
					<Box>
						<ExMenuParent>リンク</ExMenuParent>
					</Box>
				</Menu.Target>
				<Menu.Dropdown>
					<Flex gap="0.5em">
						<TextInput
							w="20em"
							size="xs"
							placeholder="https://example.com"
							value={value}
							onChange={(event) => setValue(event.currentTarget.value)}
						/>
						<Button
							size="xs"
							onClick={() => {
								onSrcChange(value);
							}}
						>
							埋め込み適用
						</Button>
					</Flex>
				</Menu.Dropdown>
			</Menu>
		</>
	);
};
