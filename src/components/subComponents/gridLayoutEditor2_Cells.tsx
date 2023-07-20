import { useRef, ChangeEvent, DragEventHandler, Dispatch, SetStateAction } from "react";

import { c } from "../../styles/eStyle";
import { edgeName, UseEditTableStateType } from "../admin/editTableComponents/hooks/useEditTableState";
import { EditableTableMenuBtn } from "../admin/editTableComponents/editTableMenu/editableTableMenuBtn";
import { TableCellData } from "../../types/types";
import { Box, CSSObject, Flex } from "@mantine/core";

const styleList = {
	ta_l: "text-align: left;",
	ta_r: "text-align: right;",
	ta_c: "text-align: center;",
	////////////////////////////
	fs_s: "font-size: 0.8em;",
	fs_m: "font-size: 1em;",
	fs_l: "font-size: 1.2em;",
	////////////////////////////
	c_bk: `color: ${c.mainBlack};`,
	c_r: `color: ${c.red};`,
	c_bl: `color: ${c.skyblue};`,
	c_lr: `color: ${c.l_red};`,
	c_lb: `color: ${c.l2_blue};`,
	c_ly: `color: ${c.l_pureyellow};`,
	c_w: `color:${c.mainWhite};`,
	////////////////////////////
	bc_bk: `background-color: ${c.mainBlack};`,
	bc_r: `background-color: ${c.red};`,
	bc_bl: `background-color: ${c.skyblue};`,
	bc_lr: `background-color: ${c.l_red};`,
	bc_lb: `background-color: ${c.l2_blue};`,
	bc_ly: `background-color: ${c.l_pureyellow};`,
	bc_w: `background-color: ${c.mainWhite};`,
	////////////////////////////
	ml_05: "padding-left: 0.5em;",
	ml_1: "padding-left: 1em;",
	ml_2: "padding-left: 2em;",
	////////////////////////////
	mr_05: "padding-right: 0.5em;",
	mr_1: "padding-right: 1em;",
	mr_2: "padding-right: 2em;",
	////////////////////////////
	border_all: `border: 4px solid ${c.skyblue};`,
	border_left: `border-left: 4px solid ${c.skyblue};`,
	border_right: `border-right: 4px solid ${c.skyblue};`,
	border_top: `border-top: 4px solid ${c.skyblue};`,
	border_bottom: `border-bottom: 4px solid ${c.skyblue};`,
};

const getStyle = (style: string): CSSObject => {
	const styles: string[] = style.replace(/ /g, "").split(",");

	const styleStr = styles
		.map((s: keyof typeof styleList) => {
			return styleList[s];
		})
		.join(" ") as unknown as CSSObject;

	return styleStr;
};

////////////////////////////////////////////////////////////////////////////////////////////
type CellType = {
	props: TableCellData;
	handleInputText?: (e: ChangeEvent<HTMLInputElement>, id: string, label: string) => void;
	handleContextMenu: any;
	setSelectedCell: Dispatch<SetStateAction<string>>;
};

type SideCellType = {
	id: string;
	editTableState: UseEditTableStateType;
	val: string;
};

type SideEdgeType = {
	id: string;
	onDragStart: DragEventHandler<HTMLDivElement>;
	onDrag: DragEventHandler<HTMLDivElement>;
};

export const Editable_Normal = ({ props, handleInputText, handleContextMenu, setSelectedCell }: CellType) => {
	//

	const { id, label, textField, style } = props;

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		height: "100%",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			autoComplete="off"
			sx={[getStyle(style), inputStyle]}
			value={textField || ""}
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onChange={(e) => {
				handleInputText(e, id, label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Normal = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		overflow: "hidden",
		border: "none",
		width: "100%",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return <Box sx={[getStyle(style), inputStyle]}>{textField}</Box>;
};

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

export const Editable_Kakaku = ({ props, handleInputText, handleContextMenu, setSelectedCell }: CellType) => {
	//
	const isComma = true; //コンマありなし設定

	const { id, label, textField, format, style, border } = props;

	const error = useRef(null);

	const getValue = (textField: string) => {
		let sepNumberStr = textField;

		if (isComma) {
			const regex = /^[0-9]+$/;
			if (textField) {
				if (regex.test(textField.replace(/,/g, ""))) {
					sepNumberStr = Number(textField.replace(/,/g, "")).toLocaleString();
					error.current = false;
				} else {
					sepNumberStr = textField;
					error.current = true;
				}
			}
		}
		return sepNumberStr;
	};

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		height: "100%",
		color: error.current ? "red" : "",
		fontFamily: '"futura-pt", sans-serif',
		fontSize: "1.6em",
		marginRight: "0.1em",
		textAlign: "right",
		lineHeight: "1.5em",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			autoComplete="off"
			sx={[getStyle(style), inputStyle]}
			value={getValue(textField) || ""}
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onChange={(e) => {
				handleInputText(e, id, label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Kakaku = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const error = useRef(null);

	let sepNumberStr = "";
	const regex = /^[0-9]+$/;
	if (textField) {
		if (regex.test(textField.replace(/,/g, ""))) {
			sepNumberStr = Number(textField.replace(/,/g, "")).toLocaleString();
			error.current = false;
		} else {
			sepNumberStr = textField;
			error.current = true;
		}
	}

	const inputStyle: CSSObject = {
		overflow: "hidden",
		border: "none",
		width: "100%",
		color: error.current ? "red" : "",
		fontFamily: '"futura-pt", sans-serif',
		fontSize: "1.6em",
		marginRight: "0.1em",
		textAlign: "right",
		lineHeight: "1.5em",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return <Box sx={[getStyle(style), inputStyle]}>{sepNumberStr}</Box>;
};

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
export const Editable_Leaders = ({ props, handleContextMenu, setSelectedCell }: CellType) => {
	//
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		overflow: "hidden",
		height: "100%",
		fontSize: "1em",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			readOnly={true}
			sx={[getStyle(style), inputStyle]}
			value=".............................................................................................................................................."
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Leaders = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		overflow: "hidden",
		border: "none",
		fontSize: "1em",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return (
		<Box sx={[getStyle(style), inputStyle]}>
			.......................................................................
		</Box>
	);
};
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

export const Editable_Yen_zeikomi = ({ props, handleContextMenu, setSelectedCell }: CellType) => {
	//
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		height: "100%",
		fontSize: "1em",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			readOnly={true}
			sx={[getStyle(style), inputStyle]}
			value="円（税込）"
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Yen_zeikomi = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		border: "none",
		overflow: "hidden",
		fontSize: "1em",
		width: "100%",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return <Box sx={[getStyle(style), inputStyle]}>円（税込）</Box>;
};

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

export const Editable_Yen_zeinuki = ({ props, handleContextMenu, setSelectedCell }: CellType) => {
	//
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		height: "100%",
		fontSize: "1em",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			readOnly={true}
			sx={[getStyle(style), inputStyle]}
			value="円（税抜）"
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Yen_zeinuki = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		overflow: "hidden",
		border: "none",
		width: "100%",
		fontSize: "1em",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return <Box sx={[getStyle(style), inputStyle]}>円（税抜）</Box>;
};

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

export const Editable_Per_tsuki = ({ props, handleContextMenu, setSelectedCell }: CellType) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		border: "none",
		width: "100%",
		height: "100%",
		whiteSpace: "nowrap",
		flexShrink: 0,
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Box
			component="input"
			readOnly={true}
			sx={[getStyle(style), inputStyle]}
			value="／月"
			onClick={(e) => {
				setSelectedCell(label);
			}}
			onContextMenu={(e) => {
				handleContextMenu(e, id);
			}}
		/>
	);
};

export const Per_tsuki = ({ props }: { props: TableCellData }) => {
	const { id, label, textField, format, style, border } = props;

	const inputStyle: CSSObject = {
		overflow: "hidden",
		border: "none",
		width: "100%",
		whiteSpace: "nowrap",
		flexShrink: 0,
	};

	return <Box sx={[getStyle(style), inputStyle]}>／月</Box>;
};

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
export const SideCell = ({ id, editTableState, val }: SideCellType) => {
	//
	const { handleSetCellWidthAuto, handleInsertCell, handleDeleteCell } = editTableState;

	const templateStyle = {
		gridArea: id,
		backgroundColor: val === "auto" || val === "1fr" ? "#ad7d7d" : "#999",
		width: "100%",
		height: "100%",
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Flex justify="center" align="center" sx={templateStyle}>
			<EditableTableMenuBtn
				type={"top_down"}
				id={id}
				handleInsertCell={handleInsertCell}
				handleDeleteCell={handleDeleteCell}
				handleSetCellWidthAuto={handleSetCellWidthAuto}
			/>
		</Flex>
	);
};

export const SideEdge = ({ id, onDragStart, onDrag }: SideEdgeType) => {
	//
	const templateStyle = {
		gridArea: `${edgeName}${id}`,
		backgroundColor: "#999",
		width: "100%",
		height: "100%",
		cursor: "pointer",
		"&:focus": {
			outline: "none",
		},
	};

	const edge = {
		"&:empty": {
			width: "100%",
			height: "100%",
			backgroundColor: "#ccc",
		},
	};

	return (
		<Box sx={templateStyle}>
			<Box draggable id={id} sx={edge} onDragStart={onDragStart} onDrag={onDrag} />
		</Box>
	);
};
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

export const TopCell = ({ id, editTableState, val }: SideCellType) => {
	//
	const { handleSetCellWidthAuto, handleInsertCell, handleDeleteCell, changeCellIdToNumber } = editTableState;

	const templateStyle = {
		gridArea: id,
		backgroundColor: val === "auto" || val === "1fr" ? "#ad7d7d" : "#999",
		width: "100%",
		height: "100%",
		"&:focus": {
			outline: "none",
		},
	};

	return (
		<Flex justify="center" align="center" sx={templateStyle}>
			<EditableTableMenuBtn
				type={"left_right"}
				id={id}
				handleInsertCell={handleInsertCell}
				handleDeleteCell={handleDeleteCell}
				handleSetCellWidthAuto={handleSetCellWidthAuto}
			/>
		</Flex>
	);
};
////////////////////////////////////////////////////////////////////////////////////////////

export const TopEdge = ({ id, onDragStart, onDrag }: SideEdgeType) => {
	//
	const templateStyle = {
		gridArea: `{edgeName}${id}`,
		// backgroundColor: val === "auto" ? "#ba7575" : "#999",
		width: "100%",
		height: "100%",
		cursor: "pointer",
		"&:focus": {
			outline: "none",
		},
	};

	const edge = {
		"&:empty": {
			width: "100%",
			height: "100%",
			backgroundColor: "#ccc",
		},
	};

	return (
		<Box sx={templateStyle}>
			<Box draggable id={id} sx={edge} onDragStart={onDragStart} onDrag={onDrag} />
		</Box>
	);
};
