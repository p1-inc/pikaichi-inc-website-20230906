import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";

import { TableType } from "../../types/types";
import { getAllComponent, getAllTables } from "../../firebase/firebase";
import TableListComp from "./editTableComponents/tableListComp";
import { Box, Button, Flex, Space, Modal } from "@mantine/core";

type TableSelecterType = {
	tableIdState: string;
	settableIdState: Dispatch<SetStateAction<string>>;
	allTables: TableType[];
	displayDialogComp: boolean;
	setCellData: Dispatch<SetStateAction<TableType>>;
	setDisplayDialogComp: Dispatch<SetStateAction<boolean>>;
};
export const TableSelector = ({
	tableIdState,
	settableIdState,
	allTables,
	setCellData,
	displayDialogComp,
	setDisplayDialogComp,
}: TableSelecterType) => {
	//

	const [checked, setChecked] = useState<string[]>([]);

	const [thumb, setThumb] = useState<any[]>([]);

	useEffect(() => {
		const f = async () => {
			const _thumb = await getAllComponent({});
			const thumb = _thumb.filter((d) => d.blockName === "table");

			setThumb(thumb);
		};

		f();
	}, []);

	const handleEdit = async (id: string) => {
		const tData = allTables.find((data) => data.id === id);
		settableIdState(id);
		setDisplayDialogComp(Boolean(false));
	};

	const handleClose = () => {
		setDisplayDialogComp(Boolean(false));
	};

	const descriptionElementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	return (
		<>
			{allTables && (
				<>
					<Modal
						centered
						opened={displayDialogComp}
						onClose={handleClose}
						title="表組みの変更"
						size="95%"
						styles={{ header: { paddingBottom: "0.5em" } }}
					>
						<Flex wrap="wrap" mb="4em">
							<TableListComp
								checked={checked}
								setChecked={setChecked}
								tableData={allTables}
								thumb={thumb}
								handleEdit={handleEdit}
							/>
						</Flex>
						<Flex
							w="100%"
							h="4em"
							m="0 auto"
							p="1em"
							align="center"
							justify="flex-end"
							gap="1em"
							sx={{
								position: "fixed",
								bottom: 0,
								left: 0,
								zIndex: 1000,
								borderRadius: "0 0 1em 1em",
								backgroundColor: "#FFF",
							}}
						>
							<Button variant="outline" w="10em" onClick={handleClose}>
								CANCEL
							</Button>
							<Button
								w="10em"
								onClick={() => {
									handleEdit(checked[0]);
								}}
							>
								O K
							</Button>
						</Flex>
					</Modal>
				</>
			)}
		</>
	);
};
