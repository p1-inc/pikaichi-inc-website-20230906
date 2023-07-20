import { useState, useEffect, useRef, useCallback } from "react";

import GridLayoutEditor2 from "./gridLayoutEditor2";
import GridLayoutEditorByText from "./gridLayoutEditorByText";

import { TableCellData } from "../../../types/types";

import { EditTableMenu } from "./editTableMenu/editTableMenu";

import { c } from "../../../styles/eStyle";
import { Box, TextInput } from "@mantine/core";
import { UseEditTableStateType } from "./hooks/useEditTableState";

export default function TableCompEditor({
	editTableState,
	width = "100%",
}: { editTableState: UseEditTableStateType; width?: string }) {
	//
	const { tableTitle, setTableTitle, selectedCell, cellData } = editTableState;

	const gridLayoutWrapper = {
		label: "gridLayoutWrapper",
		width: "100%",
		overflow: "auto",
		border: "thin solid #aaa",
	};

	const selectedCellValue = (cellData: TableCellData[][], selectedCell: string) => {
		if (!selectedCell) {
			return "";
		}
		const data: TableCellData = cellData.flat().find((d) => d.id === selectedCell);
		const str = `{"id":"${data?.id}","label":"${data?.label}","format":"${data?.format}","textField":"${data?.textField}","style":"${data?.style}","border":"${data?.border}"}`;

		return str;
	};

	return (
		<>
			<Box w={width} mt="2em">
				<TextInput
					size="md"
					mb="1em"
					label="タイトル"
					value={tableTitle}
					onChange={(e) => {
						setTableTitle(e.target.value);
					}}
					styles={{ input: { border: `2px solid ${c.defaultBlue}` } }}
				/>

				<EditTableMenu editTableState={editTableState} />
				<Box sx={gridLayoutWrapper}>
					<Box>
						<GridLayoutEditor2 editTableState={editTableState} />
					</Box>
				</Box>
			</Box>
			<TextInput value={selectedCellValue(cellData, selectedCell)} readOnly />

			<GridLayoutEditorByText editTableState={editTableState} />
		</>
	);
}
