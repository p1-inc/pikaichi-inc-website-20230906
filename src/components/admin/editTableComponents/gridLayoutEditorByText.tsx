import { useState, useEffect } from "react";

import { cArr } from "../../../styles/eStyle";

import { Box, Button, Flex, TextInput } from "@mantine/core";
import { UseEditTableStateType } from "./hooks/useEditTableState";

export default function GridLayoutEditorByText({ editTableState }: { editTableState: UseEditTableStateType }) {
	//
	const { templateColumns, setTemplateColumns, templateRows, setTemplateRows, templateAreas } = editTableState;

	const [newTemplateAreas, setNewTemplateAreas] = useState<string>("");
	const [newTemplateColumns, setNewTemplateColumns] = useState<string>("");
	const [newTemplateRows, setNewTemplateRows] = useState<string>("");

	const handleSubmit = () => {
		const colArr = newTemplateColumns.split(" ");
		setTemplateColumns(colArr);

		const rowArr = newTemplateRows.split(" ");
		setTemplateRows(rowArr);
	};

	useEffect(() => {
		const template = templateAreas.replace(/"\s*"/g, '"\n"');
		setNewTemplateAreas(template);

		setNewTemplateColumns(templateColumns.join(" "));
		setNewTemplateRows(templateRows.join(" "));
	}, [templateAreas, templateColumns, templateRows]);

	return (
		<Box w="80%" mt="1em" p="1em" sx={{ border: `1px solid ${cArr.gray[4]}`, borderRadius: "0.5rem" }}>
			<Flex>
				<TextInput
					w="100%"
					value={newTemplateColumns}
					onChange={(e) => {
						setNewTemplateColumns(e.target.value);
					}}
				/>

				<Flex align="center" justify="center" w="7em" h="2em" p=" 1em">
					列（横）
				</Flex>
			</Flex>
			<Flex mt="1em">
				<TextInput
					w="100%"
					value={newTemplateRows}
					onChange={(e) => {
						setNewTemplateRows(e.target.value);
					}}
				/>

				<Flex align="center" justify="center" w="7em" h="2em" p=" 1em">
					行（縦）
				</Flex>
			</Flex>
			<Button mt="1em" variant="outline" onClick={handleSubmit}>
				更　新
			</Button>
		</Box>
	);
}
