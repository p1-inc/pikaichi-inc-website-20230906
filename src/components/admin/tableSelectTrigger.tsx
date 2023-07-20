import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { c } from "../../styles/eStyle";
import TableComp from "../subComponents/tableComp";
import { TableSelector } from "./tableSelector";
import { Button, CSSObject, Flex, Modal, UnstyledButton } from "@mantine/core";
import { TableType } from "../../types/types";
import { getAllTables } from "../../firebase/firebase";

type DialogCompType = {
	dialogOpen: boolean;
	setDialogOpen: Dispatch<SetStateAction<boolean>>;
	handleDialogClose: () => void;
	setCellData: Dispatch<SetStateAction<TableType>>;
	sizeState: SizeType;
	setSizeState: Dispatch<SetStateAction<SizeType>>;
	setDisplayDialogComp: Dispatch<SetStateAction<boolean>>;
};
const DialogComp = ({
	dialogOpen,
	setDialogOpen,
	handleDialogClose,
	setCellData,
	sizeState,
	setSizeState,
	setDisplayDialogComp,
}: DialogCompType) => {
	const handleSizeChange = (size: SizeType) => {
		setSizeState(size);
		handleDialogClose();
	};

	const sizeItem: SizeType[] = ["xs", "s", "m", "l", "xl"];

	return (
		<>
			<Modal
				centered
				opened={dialogOpen}
				onClose={handleDialogClose}
				title="画像の変更aaa"
				size="lg"
				styles={{ header: { paddingBottom: "0.5em" } }}
			>
				<Flex w="25em" m="0 auto" direction="column">
					<Button.Group orientation="vertical">
						{sizeItem.map((size) => (
							<Button
								key={size}
								uppercase
								w="100%"
								variant="outline"
								sx={{ backgroundColor: size === sizeState ? c.l_yellow : "" }}
								onClick={() => {
									handleSizeChange(size);
								}}
							>
								サイズ {size}
								{size === sizeState ? "*" : ""}
							</Button>
						))}
					</Button.Group>
					<Flex w="25em" m="0 auto" mt="1em" direction="column" gap="0.3em">
						<Button
							w="100%"
							variant="outline"
							onClick={() => {
								setDisplayDialogComp(true);
								setDialogOpen(false);
							}}
						>
							表組みの変更
						</Button>
						<Button
							w="100%"
							variant="outline"
							onClick={() => {
								setCellData(null);
								setDialogOpen(false);
							}}
						>
							表組みの削除
						</Button>
						<Button w="100%" variant="subtle" onClick={handleDialogClose}>
							CANCEL
						</Button>
					</Flex>
				</Flex>
			</Modal>
		</>
	);
};

export type SizeType = "xs" | "s" | "m" | "l" | "xl";

type TableSelectorCompType = {
	tableId: string;
	size: SizeType;
	onCellDataChange: any;
	onSizeChange: any;
	readOnly?: boolean;
};

export const TableSelectTrigger = ({
	tableId = "",
	size = "m",
	onCellDataChange,
	onSizeChange,
	readOnly = false,
}: TableSelectorCompType) => {
	//

	const [displayDialogComp, setDisplayDialogComp] = useState<boolean>(false);
	const [cellData, setCellData] = useState<TableType>();
	const [tableIdState, setTableIdState] = useState<string>(tableId);
	const [allTables, setAllTables] = useState<TableType[]>([]);
	const [sizeState, setSizeState] = useState<SizeType>(size);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		const f = async () => {
			const tables = await getAllTables({});
			setAllTables(tables);
		};
		f();
	}, []);

	useEffect(() => {
		const tableData = allTables.find((d) => d.id === tableIdState);
		setCellData(tableData ? tableData : null);

		onCellDataChange(tableIdState);
		onSizeChange(sizeState);
		// setTableIdState(tableId);
	}, [tableIdState, sizeState, allTables]);

	const handleChange = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const getContentSize = (size: SizeType) => {
		if (size === "xs") {
			return "0.6em";
		} else if (size === "s") {
			return "0.7em";
		} else if (size === "m") {
			return "0.8em";
		} else if (size === "l") {
			return "0.9em";
		} else if (size === "xl") {
			return "1em";
		} else {
			return "0.6em";
		}
	};
	const tableContainer: CSSObject = {
		width: "fit-content",
		fontSize: getContentSize(sizeState),
		userSelect: "none",
		marginBottom: "1em",
		"&:hover": {
			opacity: readOnly ? 1 : 0.8,
		},
	};

	if (!readOnly) {
		return (
			<>
				{!cellData && (
					<Button
						sx={{ marginBottom: "1em" }}
						size="md"
						fullWidth
						variant="outline"
						onClick={() => {
							setDisplayDialogComp(true);
						}}
					>
						表組みの選択
					</Button>
				)}

				{cellData && (
					<UnstyledButton sx={tableContainer} onClick={handleChange}>
						<TableComp tableData={cellData} size={sizeState} />
					</UnstyledButton>
				)}

				<TableSelector
					tableIdState={tableIdState}
					settableIdState={setTableIdState}
					allTables={allTables}
					setCellData={setCellData}
					displayDialogComp={displayDialogComp}
					setDisplayDialogComp={setDisplayDialogComp}
				/>

				<DialogComp
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
					setCellData={setCellData}
					sizeState={sizeState}
					setSizeState={setSizeState}
					setDisplayDialogComp={setDisplayDialogComp}
					handleDialogClose={handleDialogClose}
				/>
			</>
		);
	} else {
		return <>{cellData && <TableComp tableData={cellData} size={sizeState} />}</>;
	}
};
