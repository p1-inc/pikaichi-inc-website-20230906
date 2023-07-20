import { Box, Flex } from "@mantine/core";
import { TableCellData, TableType } from "../../types/types";
import { UseEditTableStateType } from "../admin/editTableComponents/hooks/useEditTableState";
import { Normal, Kakaku, Leaders, Yen_zeikomi, Yen_zeinuki, Per_tsuki } from "./gridLayoutEditor2_Cells";

export default function GridLayout({ tableData }: { tableData: TableType }) {
	//
	const { cellData, templateAreas, templateColumns, templateRows } = tableData;

	const container = {
		width: "fit-content",
		margin: "0 auto",
		display: "grid",
		gridTemplateAreas: templateAreas,
		gridTemplateColumns: templateColumns.join(" "),
		gridTemplateRows: templateRows.join(" "),
	};

	const sameCellLabel: string[] = []; //labelの結合(ダブり)排除
	const nCellData = cellData.flat().flatMap((row) => {
		if (row.label.length !== 4) {
			if (!sameCellLabel.includes(row.label)) {
				sameCellLabel.push(row.label);
			} else {
				return [];
			}
		}
		return row;
	});
	return (
		<Box sx={container}>
			{nCellData.map((props: TableCellData) => {
				const templateStyle = {
					label: "templateStyle",
					gridArea: props.label,
					overflow: "hidden",
					minWidth: "1em",
					height: "100%",
				};

				return (
					<Flex align="center" id={props.id} key={props.id} sx={templateStyle}>
						{props.format === "normal" ? <Normal props={props} /> : ""}
						{props.format === "kakaku" ? <Kakaku props={props} /> : ""}
						{props.format === "leaders" ? <Leaders props={props} /> : ""}
						{props.format === "yen_zeikomi" ? <Yen_zeikomi props={props} /> : ""}
						{props.format === "yen_zeinuki" ? <Yen_zeinuki props={props} /> : ""}
						{props.format === "per_tsuki" ? <Per_tsuki props={props} /> : ""}
					</Flex>
				);
			})}
		</Box>
	);
}
