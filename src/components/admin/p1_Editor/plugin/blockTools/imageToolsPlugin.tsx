import { Box, Flex, Menu, Text } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { ImageSelectTrigger } from "../../../imageSelectTrigger";
import { CSSProperties, useState } from "react";

import { cArr } from "../../../../../styles/eStyle";
import { ExMenuChild, ExMenuParent } from "../../../../UILib/extendMantine";
import { SizeType } from "../../../tableSelectTrigger";
import { MediaLib } from "../../../../../types/types";

const sizeList: { id: string; label: string; retio: number }[] = [
	{ id: "xs", label: "サイズ[XS]", retio: 0.6 },
	{ id: "s", label: "サイズ[S]", retio: 0.7 },
	{ id: "m", label: "サイズ[M]", retio: 0.8 },
	{ id: "l", label: "サイズ[L]", retio: 0.9 },
	{ id: "xl", label: "サイズ[XL]", retio: 1 },
];

type DataType = {
	align: CSSProperties["textAlign"];
	imgData: MediaLib;
	size: SizeType;
};

export const ImageTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;

	const { readOnly }: BlockControlType = api;

	const onImgUrlChange = (newData: MediaLib) => {
		if (!newData?.id) {
			return;
		}
		api.handleAddBlockData({
			id: blockData.id,
			data: { imgData: newData },
		});
	};

	const onSizeChange = (size: string) => {
		api.handleAddBlockData({ id: blockData.id, data: { size: size } });
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
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={ImageToolTuneMenu} api={api} mb="2em">
			<Flex
				className={`${api.p1_globalClassName.block} ${api.p1_globalClassName.blockContent} ${blockTool.className}
				`}
				justify={getAlign(nData.align)}
				my="0.4em"
			>
				<ImageSelectTrigger
					imgData={nData.imgData}
					size={nData.size}
					onImgUrlChange={onImgUrlChange}
					onSizeChange={onSizeChange}
					readOnly={readOnly}
				/>
			</Flex>
		</P1_EditorWrapper>
	);
};

const ImageToolTuneMenu = ({
	id,
	blockData,
	api,
}: { id: string; blockData: OutputBlockData; api: BlockControlType }) => {
	//
	const isSameSize = (size: string) => {
		if ("size" in blockData.data && blockData.data.size === size) {
			return true;
		}
		return false;
	};

	return (
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
	);
};
