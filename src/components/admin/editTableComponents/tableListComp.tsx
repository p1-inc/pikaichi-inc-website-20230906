import { useState, useRef, Dispatch, SetStateAction, CSSProperties } from "react";
import Image from "next/future/image";
import { c, cArr } from "../../../styles/eStyle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// import TableComp from "./TableComp";
import { CompListType, TableType } from "../../../types/types";
import { Box, Card, CSSObject, Flex, Group, Text } from "@mantine/core";
import { useDoubleClick } from "../../../hooks/useDoubleClick";

type TableListCompType = {
	checked: string[];
	setChecked: Dispatch<SetStateAction<string[]>>;
	tableData: TableType[];
	thumb: CompListType[];
	handleEdit: (id: string) => Promise<void>;
};
export default function TableListComp({ checked, setChecked, tableData, thumb, handleEdit }: TableListCompType) {
	//

	const handleNormalClicked = (id: string) => {
		const nChecked = [...checked];
		const isCheckedId = nChecked.findIndex((d) => d === id);
		if (isCheckedId === -1) {
			nChecked.push(id);
		} else {
			nChecked.splice(isCheckedId, 1);
		}
		setChecked(nChecked);
	};

	const { handleClicked } = useDoubleClick({ handleNormalClicked, handleDoubleClicked: handleEdit });
	// 	const handleClicked = (id: string) => {
	// 		clickCount.current++;
	//
	// 		if (!checked.includes(id)) {
	// 			handleChecked(id);
	// 		}
	//
	// 		if (clickCount.current < 2) {
	// 			setTimeout(() => {
	// 				if (1 < clickCount.current) {
	// 					handleEdit(id);
	// 				} else {
	// 					if (checked.includes(id)) {
	// 						handleChecked(id);
	// 					}
	// 				}
	// 				clickCount.current = 0;
	// 			}, 300);
	// 		}
	// 	};

	const getThumbSrc = (tId: string) => {
		const _data = thumb.find((d) => d.subName === tId);
		const res = _data?.thumbImage;
		return res;
	};

	return (
		<>
			{tableData.map((table: TableType) => {
				const imgSrc = getThumbSrc(table.id);
				return (
					<Card
						key={`${table.id}`}
						shadow="sm"
						p="xs"
						w="16em"
						h="13em"
						m="0.5em"
						radius="md"
						withBorder={checked.includes(table.id) ? false : true}
						onClick={() => {
							handleClicked(table.id);
						}}
						sx={{
							cursor: "pointer",
							border: checked.includes(table.id) ? "3px solid" : "0.1px solid",
							borderColor: checked.includes(table.id) ? c.defaultBlue : cArr.gray[5],
							"&:hover": { opacity: 0.5 },
						}}
					>
						<Flex h="100%" direction="column" justify="space-between">
							{imgSrc && (
								<Box
									component={Image}
									sx={{
										width: "100%",
										height: "6em",
										objectFit: "contain",
										objectPosition: "top",
									}}
									src={imgSrc}
									alt="table image"
									width="500"
									height="500"
								/>
							)}

							<Box m="0.3em" fz="0.8em">
								<Text component="p" truncate fz="0.5em" color={c.mainBlack}>
									{table?.id.slice(0, 8)}
								</Text>

								<Text component="p" truncate fz="1em" color={c.mainBlack}>
									{table?.tableTitle}
								</Text>
								<Flex w="100%" justify="space-between">
									<Flex fz="0.6em" mt="0.5em" color={c.mainBlack} align="center">
										<AccessTimeIcon sx={{ fontSize: "1.9em" }} />
										<Text ml="0.5em">{table?.updatedAt}</Text>
									</Flex>
									<Text sx={{ color: c.pink }}>{table?.usage ? "※" : ""}</Text>
								</Flex>
							</Box>
						</Flex>
					</Card>
				);
			})}
		</>
	);
}
