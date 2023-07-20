import { useEffect, useState } from "react";

import {
	SideCell,
	TopCell,
	SideEdge,
	TopEdge,
	Editable_Normal,
	Editable_Kakaku,
	Editable_Leaders,
	Editable_Yen_zeikomi,
	Editable_Yen_zeinuki,
	Editable_Per_tsuki,
} from "../../subComponents/gridLayoutEditor2_Cells";
import { Box, CSSObject, Flex, Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { UseEditTableStateType } from "./hooks/useEditTableState";
import { TableCellData } from "../../../types/types";

export default function GridLayoutEditor2({ editTableState }: { editTableState: UseEditTableStateType }) {
	//

	const [openMenu, setOpeneMenu] = useState<string[]>([]);

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //セルの記号の順番

	const {
		edgeName,

		handleOnDrag,
		handleOnDragStart,
		topCellAreas,
		topCellColmns,
		sideCellAreas,
		sideCellRows,
		cellData,
		templateAreas,
		templateColumns,
		templateRows,

		selectedCell,
		setSelectedCell,

		handleInputText,

		handleMergeCell,
		handleUnmergeCell,
	} = editTableState;

	const MenuItem = [
		{
			key: "mergeRightCell",
			dir: "right",
			handle: "merge",
			text: "右側のセルと結合",
		},

		{
			key: "mergeLeftCell",
			dir: "left",
			handle: "merge",
			text: "左側のセルと結合",
		},
		{
			key: "unbindCell",
			dir: "left",
			handle: "unmerge",
			text: "結合を解除",
		},
	];

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

	const handleFunc = (id: string, dir: string, handle: string, cellData: TableCellData[][]) => {
		if (handle === "merge") {
			handleMergeCell({ id, dir, cellData });
		} else if (handle === "unmerge") {
			handleUnmergeCell({ id, dir, cellData });
		} else {
			return;
		}
	};

	const handleContextOpenMenu = (e: any, id: string) => {
		e.preventDefault();
		const nSet = new Set(openMenu);
		nSet.add(id);
		setOpeneMenu(Array.from(nSet));
	};

	const handleContextCloseMenu = (id: string) => {
		const nSet = new Set(openMenu);
		nSet.delete(id);
		setOpeneMenu(Array.from(nSet));
	};

	const sideTopCellStyle = {
		width: "3em",
		height: "1em",
		backgroundColor: "#aaa",
	};

	const topCellStyle = {
		label: "topCellStyle",
		display: "grid",
		gridTemplateAreas: `"${topCellAreas.join(" ")}"`,
		gridTemplateColumns: topCellColmns,
		gridTemplateRows: "1em",
	};

	const sideCellStyle = {
		display: "grid",
		gridTemplateAreas: sideCellAreas.map((cell) => `"${cell}"`).join(" "),
		gridTemplateColumns: "3em",
		gridTemplateRows: sideCellRows,
	};

	const gridWrapper = {
		display: "grid",
		gridTemplateAreas: templateAreas,
		gridTemplateColumns: templateColumns.join(" "),
		gridTemplateRows: templateRows.join(" "),
	};

	return (
		<Flex fz="1.5em" m="0 auto">
			<Flex direction="column">
				<Box sx={sideTopCellStyle} />
				<Box sx={sideCellStyle}>
					{sideCellAreas.map((cell, index) => {
						const num = Math.floor(index / 2);
						const keyStr = `XXX${`000${num}`.slice(-3)}`;
						if (index % 2 === 0) {
							return <SideCell key={keyStr} id={keyStr} editTableState={editTableState} val={cell} />;
						} else {
							return (
								<Tooltip key={`${edgeName}${keyStr}`} label={sideCellRows.split(" ")[index - 1]} closeDelay={500}>
									<Box>
										<SideEdge id={keyStr} onDragStart={handleOnDragStart} onDrag={handleOnDrag} />
									</Box>
								</Tooltip>
							);
						}
					})}
				</Box>
			</Flex>
			<Flex direction="column">
				<Box sx={topCellStyle}>
					{templateColumns
						.flatMap((cell, index) => [cell, cell])
						.map((cell, index) => {
							const keyStr = `${alphabet[Math.floor(index / 2)]}000`;
							if (index % 2 === 0) {
								return <TopCell key={keyStr} id={keyStr} editTableState={editTableState} val={cell} />;
							} else {
								return (
									<Tooltip key={`${edgeName}${keyStr}`} label={topCellColmns.split(" ")[index - 1]} closeDelay={500}>
										<Box>
											<TopEdge id={keyStr} onDragStart={handleOnDragStart} onDrag={handleOnDrag} />
										</Box>
									</Tooltip>
								);
							}
						})}
				</Box>

				<Box sx={gridWrapper}>
					{nCellData.map((props) => {
						const cellBox: CSSObject = {
							label: "cellBox",
							fontSize: "0.7em",
							gridArea: props.label,
							display: "flex",
							alignItems: "center",
							width: "100%",
							height: "100%",
							overflow: "hidden",
							border: "thin dashed #afdeff",
							outline: selectedCell === props.label ? "4px solid #0479cd" : "",
							outlineOffset: "-4px",
							"&:focus": {
								outline: "none",
							},
						};

						return (
							<Box key={props.id} id={props.id} sx={cellBox}>
								<Menu
									shadow="md"
									width={200}
									opened={openMenu.includes(props.id)}
									onChange={() => {
										handleContextCloseMenu(props.id);
									}}
								>
									<Menu.Target>
										<Box w="100%">
											{props.format === "normal" ? (
												<Editable_Normal
													props={props}
													handleInputText={handleInputText}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
											{props.format === "kakaku" ? (
												<Editable_Kakaku
													props={props}
													handleInputText={handleInputText}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
											{props.format === "leaders" ? (
												<Editable_Leaders
													props={props}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
											{props.format === "yen_zeikomi" ? (
												<Editable_Yen_zeikomi
													props={props}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
											{props.format === "yen_zeinuki" ? (
												<Editable_Yen_zeinuki
													props={props}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
											{props.format === "per_tsuki" ? (
												<Editable_Per_tsuki
													props={props}
													handleContextMenu={handleContextOpenMenu}
													setSelectedCell={setSelectedCell}
												/>
											) : (
												""
											)}
										</Box>
									</Menu.Target>
									<Menu.Dropdown>
										{MenuItem.map((item) => (
											<Menu.Item key={item.key} onClick={(e) => handleFunc(props.id, item.dir, item.handle, cellData)}>
												{item.text}
											</Menu.Item>
										))}
									</Menu.Dropdown>
								</Menu>
							</Box>
						);
					})}
				</Box>
			</Flex>
		</Flex>
	);
}
