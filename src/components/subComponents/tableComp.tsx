import { Box, CSSObject, Flex } from "@mantine/core";
import { c, bp } from "../../styles/eStyle";
import { TableType } from "../../types/types";
import { UseEditTableStateType } from "../admin/editTableComponents/hooks/useEditTableState";

import GridLayout from "./gridLayout";
import { SizeType } from "../admin/tableSelectTrigger";

const TableComp = ({ tableData }: { tableData: TableType; size?: SizeType }) => {
	//

	const tableWrapper: CSSObject = {
		width: "100%",
		margin: "0 auto",
		backgroundColor: "#fff",
		// fontSize: sizeMap[size],
	};

	const topTitle: CSSObject = {
		label: "topTitle",
		borderRadius: "1em 1em 0 0",
		backgroundColor: c.skyblue,
		textAlign: "center",
		height: "2em",
		color: "#fff",
		fontSize: "1em",
	};

	const gridLayoutWrapper: CSSObject = {
		label: "gridLayoutWrapper",
		width: "100%",
		border: `3px solid ${c.skyblue}`,
		borderRadius: "0 0 1em 1em",
		overflow: "auto",
	};

	const gridLayoutInner: CSSObject = {
		width: "100%",
		padding: "1em 2em",
		margin: "0 auto",
		marginTop: "0.5em",
		textAlign: "center",
		fontSize: "1em",
		// [bp.sp]: { fontSize: "1em" },
	};

	return (
		<>
			{tableData && (
				<Box sx={tableWrapper}>
					<Flex justify="center" align="center" sx={topTitle}>
						{tableData.tableTitle}
					</Flex>
					<Box sx={gridLayoutWrapper}>
						<Box sx={gridLayoutInner}>
							<GridLayout tableData={tableData} />
						</Box>
					</Box>
				</Box>
			)}
		</>
	);
};

export default TableComp;
