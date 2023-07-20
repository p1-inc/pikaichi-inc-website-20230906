import { Box, Flex, NavLink, NumberInput, Text } from "@mantine/core";
import { BlockControlType, OutputBlockData, InitialToolPropsType } from "../../p1_EditorTypes";

import { P1_EditorWrapper } from "../../p1_EditorWrapper";
import { CSSProperties } from "react";
import { SizeType, TableSelectTrigger } from "../../../tableSelectTrigger";

const sanitize = {}; // ｂlｃｋDataの内、プロパティtextをsanitaizeする。<br/>タグは許可する

// type SizeType = "xs" | "s" | "m" | "l" | "xl";

type DataType = {
	align: CSSProperties["textAlign"];
	tableId: string;
	size: SizeType;
};

export const TableTool = ({ blockData, blockTool, api }: InitialToolPropsType) => {
	//
	const nData = { ...blockTool.defaultData, ...blockData.data } as DataType;

	// const nData = api.mergeBlockData({ defaultData: blockTool.defaultData, newData: blockData.data }) as DataType;

	const { readOnly }: BlockControlType = api;

	const onCellDataChange = (id: string) => {
		api.handleAddBlockData({ id: blockData.id, data: { tableId: id } });
	};

	const onSizeChange = (size: string) => {
		api.handleAddBlockData({ id: blockData.id, data: { size: size } });
	};

	const getAlign = (align: string) => {
		if (align === "right") {
			return "flex-end";
		} else if (align === "center") {
			return "center";
		} else {
			return "flex-start";
		}
	};
	return (
		<P1_EditorWrapper blockData={blockData} BlockTuneMenu={null} api={api} mb="2em">
			<Flex
				className={`${api.p1_globalClassName.block} ${api.p1_globalClassName.blockContent} ${blockTool.className}
				`}
				justify={getAlign(nData?.align)}
				my="0.4em"
			>
				<TableSelectTrigger
					tableId={nData.tableId}
					size={nData.size}
					onCellDataChange={onCellDataChange}
					onSizeChange={onSizeChange}
					readOnly={readOnly}
				/>
			</Flex>
		</P1_EditorWrapper>
	);
};
