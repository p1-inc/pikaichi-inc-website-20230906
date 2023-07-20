import { autoID } from "./../../../../util/autoID";
import {
	useState,
	useEffect,
	useRef,
	useCallback,
	Dispatch,
	SetStateAction,
	DragEventHandler,
	ChangeEvent,
} from "react";

export const edgeName = "_edge_";
export const edgeW: [number, string] = [0.3, "em"]; //エッジの幅(1)

import { TableType, TableCellData, TableCellDataInitObj, TableFormat } from "../../../../types/types";

import { getAllTables, getAllTables_readOnly } from "../../../../firebase/firebase";

import { getMenuTagArr } from "../editTableMenu/editTableMenuItems";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; //セルの記号の順番

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////セル記号から数値の配列に変更（A0=>[0][0]）///////////////
export const changeCellIdToNumber = (str: string): number[] => {
	//
	const reg = new RegExp(/^XXX[0-9]+/);
	const isSide = reg.test(str); //sideCellかどうか（XXX000）

	if (!isSide && str.length !== 4) {
		console.log(`ID記号が不正です（例：A001、B002、、）:::${str}`);
		return [0, 0];
	}

	if (isSide) {
		const sId = "XXX";
		const sNum = str.replace("XXX", "");
		const isNum = /^[0-9]{3}$/.test(sNum);

		if (!isNum) {
			console.log(`ID記号が不正です（例：A001、B002、、）:::${str}`);
			return [0, 0];
		}
		return [-1, Number(sNum)];
	} else {
		const id1: string = str[0];
		const id2: string = str[1] + str[2] + str[3];

		const regex1 = new RegExp(`[${alphabet}]`);
		const regex2 = new RegExp("[0-9]{3}");
		const f1 = regex1.test(id1);
		if (!f1) {
			console.log(`ID記号の1文字目がアルファベットではありません）:::${id1}`);
			return [0, 0];
		}

		const f2 = regex2.test(id2[0]);
		const f3 = regex2.test(id2[1]);
		const f4 = regex2.test(id2[2]);
		if (!(f2 && f3 && f4)) {
			console.log(`ID記号の2文字目以降が数字ではありません）:::${id2}`);
			return [0, 0];
		}

		const id1N: number = alphabet.indexOf(id1);
		const id2N: number = Number(id2) - 1;

		//////戻り値はA1=[0,0]、A2=[0,1]、、///

		return [id1N, id2N];
	}
};
////////セル記号から数値の配列に変更（A0=>[0][0]）///////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
export type UseEditTableStateType = {
	edgeName: string;
	edgeW: [number, string];
	handleOnDrag: DragEventHandler<HTMLDivElement>;
	handleOnDragStart: DragEventHandler<HTMLDivElement>;
	idState: string;
	setIdState: Dispatch<SetStateAction<string>>;
	tableReadOnly: boolean;
	setTableReadOnly: Dispatch<SetStateAction<boolean>>;
	tableTitle: string;
	setTableTitle: Dispatch<SetStateAction<string>>;
	topCellAreas: string[];
	setTopCellAreas: Dispatch<SetStateAction<string[]>>;
	topCellColmns: string;
	setTopCellColmns: Dispatch<SetStateAction<string>>;
	sideCellAreas: string[];
	setSideCellAreas: Dispatch<SetStateAction<string[]>>;
	sideCellRows: string;
	setSideCellRows: Dispatch<SetStateAction<string>>;
	cellData: TableCellData[][];
	setCellData: Dispatch<SetStateAction<TableCellData[][]>>;
	templateAreas: string;
	setTemplateAreas: Dispatch<SetStateAction<string>>;
	templateColumns: string[];
	setTemplateColumns: Dispatch<SetStateAction<string[]>>;
	templateRows: string[];
	setTemplateRows: Dispatch<SetStateAction<string[]>>;
	tableCreatedAt: string;
	setTableCreatedAt: Dispatch<SetStateAction<string>>;
	tableUpdatedAt: string;
	setTableUpdatedAt: Dispatch<SetStateAction<string>>;
	thumbImageUrlState: string;
	setThumbImageUrlState: Dispatch<SetStateAction<string>>;
	anchorElContextMenu: {};
	setAnchorElContextMenu: Dispatch<SetStateAction<{}>>;
	selectedCell: string;
	setSelectedCell: Dispatch<SetStateAction<string>>;

	handleImportTable: (id: string, isDuplicate?: boolean) => Promise<string>;
	getExportTableData: (nTableId: string, cellData: TableCellData[][]) => TableType;

	// handleSetSelectedCell: MouseEventHandler<HTMLButtonElement>;
	// handleContextMenu: MouseEventHandler<HTMLInputElement>;
	// handleClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;

	handleSetCellWidthAuto: ({
		id,
	}: {
		id: string;
	}) => Promise<void>;

	handleInputText: (e: ChangeEvent<HTMLInputElement>, id: string, label: string) => void;

	handleInsertCell: ({
		id,
		dir,
	}: {
		id: string;
		dir: string;
	}) => void;

	handleDeleteCell: ({
		id,
	}: {
		id: string;
	}) => void;

	handleMergeCell: ({
		id,
		dir,
		cellData,
	}: {
		id: string;
		dir: string;
		cellData: TableCellData[][];
	}) => void;

	handleUnmergeCell: ({
		id,
		dir,
		cellData,
	}: {
		id: string;
		dir: string;
		cellData: TableCellData[][];
	}) => void;

	handleChangeStyle: (tag: string) => void;
	handleChangeFormat: (tag: string) => void;
	splitNumUnitToArr: (str: string) => string | [number, string];
	changeCellIdToNumber: (str: string) => number[];
};

export const useEditTableState = (): UseEditTableStateType => {
	const [idState, setIdState] = useState("");
	const [tableReadOnly, setTableReadOnly] = useState(false);
	const [tableTitle, setTableTitle] = useState("");

	const [topCellAreas, setTopCellAreas] = useState([]);
	const [topCellColmns, setTopCellColmns] = useState<string>("");
	const [sideCellAreas, setSideCellAreas] = useState<string[]>([]);
	const [sideCellRows, setSideCellRows] = useState<string>("");

	const [cellData, setCellData] = useState<TableCellData[][]>([]);
	const [templateAreas, setTemplateAreas] = useState<string>("");
	const [templateColumns, setTemplateColumns] = useState<string[]>([]);

	const [templateRows, setTemplateRows] = useState<string[]>([]);

	const [selectedCell, setSelectedCell] = useState<string>("");

	const [tableCreatedAt, setTableCreatedAt] = useState<string>("");
	const [tableUpdatedAt, setTableUpdatedAt] = useState<string>("");

	const [thumbImageUrlState, setThumbImageUrlState] = useState<string>("");

	const [anchorElContextMenu, setAnchorElContextMenu] = useState({});

	const templateColumnsRef = useRef(null);
	templateColumnsRef.current = templateColumns;

	const templateRowsRef = useRef(null);
	templateRowsRef.current = templateRows;

	interface positionType {
		id: number[];
		tW: string | [number, string];
		tH: string | [number, string];
		x: number;
		y: number;
	}
	const position = useRef<positionType>();

	const getTopCellColumns = (templateColumns: string[]) => {
		const result = templateColumns.flatMap((cell, index) => {
			let res;
			// if (cell === "auto") {
			// 	return [cell, edgeW.join("")];
			// }
			let nCell = get15XRemoveNumCell(cell, edgeW[0]);
			if (index === 0) {
				nCell = get15XRemoveNumCell(cell, edgeW[0] / 2);
			}
			if (index === templateColumns.length - 1) {
				res = [nCell, `${edgeW[0] / 2}${edgeW[1]}`];
			} else {
				res = [nCell, edgeW.join("")];
			}

			return res;
		});
		return result;
	};

	const getTopCellAreas = (templateColumns: string[]) => {
		const result = templateColumns
			.flatMap(() => [0, 1])
			.map((cell, index) => {
				const num = Math.floor(index / 2);
				if (index % 2 === 0) {
					return `${alphabet[num]}000`;
				} else {
					return `${edgeName}${alphabet[num]}000`;
				}
			});
		return result;
	};

	const getSideCellRows = (templateRows: string[]) => {
		const result = templateRows.flatMap((cell, index) => {
			let nCell = get15XRemoveNumCell(cell, edgeW[0]);
			if (index === 0) {
				nCell = get15XRemoveNumCell(cell, edgeW[0] / 2);
			}

			const result = [nCell, edgeW.join("")];

			return result;
		});
		return result;
	};

	const getSideCellAreas = (templateRows: string[]) => {
		const result = templateRows
			.flatMap(() => [0, 1])
			.map((cell, index) => {
				const num = `XXX${`000${Math.floor(index / 2)}`.slice(-3)}`;

				if (index % 2 === 0) {
					return `${num}`;
				} else {
					return `_edge_${num}`;
				}
			});
		return result;
	};

	useEffect(() => {
		if (templateColumns.length === 0) {
			return;
		}
		const nArr1 = getTopCellColumns(templateColumns);
		setTopCellColmns(nArr1.join(" "));

		const nArr2 = getTopCellAreas(templateColumns);
		setTopCellAreas(nArr2);
	}, [templateAreas]);

	useEffect(() => {
		if (templateRows.length === 0) {
			return;
		}
		const nArr1 = getSideCellRows(templateRows);
		setSideCellRows(nArr1.join(" "));

		const nArr2 = getSideCellAreas(templateRows);
		setSideCellAreas(nArr2);
	}, [templateAreas]);

	const handleOnDrag: DragEventHandler<HTMLDivElement> = useCallback((e) => {
		if (e.clientX <= 0 || e.clientY <= 0) {
			return;
		}
		const targetCellId = position.current.id;

		const moveX = (e.clientX - position.current.x) / 32;
		const moveY = (e.clientY - position.current.y) / 32;

		const tW = position.current.tW;
		const tH = position.current.tH;

		let nStr;

		if (targetCellId[0] === -1) {
			if (Array.isArray(tH) && tH[1] !== "fr") {
				//数値+単位の場合
				const num = Number(tH[0]) + moveY;
				nStr = `${Math.floor(num * 100) / 100}${tH[1]}`;
			} else if (Array.isArray(tW) && tW[1] === "fr") {
				nStr = tW.join("");
			} else {
				//auto等の場合
				nStr = tH;
			}

			const nArr1 = [...templateRowsRef.current];
			nArr1[targetCellId[1]] = nStr;
			setTemplateRows(nArr1);
			const nArr2 = getSideCellRows(nArr1);
			setSideCellRows(nArr2.join(" "));
		} else {
			if (Array.isArray(tW) && tW[1] !== "fr") {
				//数値+単位の場合
				const num = Number(tW[0]) + moveX;
				nStr = `${Math.floor(num * 100) / 100}${tW[1]}`;
			} else if (Array.isArray(tW) && tW[1] === "fr") {
				nStr = tW.join("");
			} else {
				//auto等の場合
				nStr = tW;
			}

			const nArr1 = [...templateColumnsRef.current];
			console.log("nArr1: ", nArr1);
			nArr1[targetCellId[0]] = nStr;
			setTemplateColumns(nArr1);

			const nArr2 = getTopCellColumns(nArr1);
			setTopCellColmns(nArr2.join(" "));
		}
	}, []);

	const handleOnDragStart: DragEventHandler<HTMLDivElement> = useCallback((e) => {
		//
		const dragId = e.currentTarget.id.replace("_edge_", "");
		const dragIdNumArr = changeCellIdToNumber(dragId);

		if (dragIdNumArr[0] === -1) {
			//ドラッグしたのは side
			let targetHeight;

			if (templateRowsRef.current[dragIdNumArr[1]] === "auto") {
				targetHeight = "auto";
			} else {
				targetHeight = splitNumUnitToArr(templateRowsRef.current[dragIdNumArr[1]]);
			}

			position.current = {
				id: dragIdNumArr, // columnの場合[1,-1]
				tW: "",
				tH: targetHeight,
				x: e.clientX,
				y: e.clientY,
			};
		} else {
			//ドラッグしたのは Top
			let targetWidth;

			if (templateColumnsRef.current[dragIdNumArr[0]] === "auto") {
				targetWidth = "auto";
			} else {
				targetWidth = splitNumUnitToArr(templateColumnsRef.current[dragIdNumArr[0]]);
			}

			position.current = {
				id: dragIdNumArr, // columnの場合[1,-1]
				tW: targetWidth,
				tH: "",
				x: e.clientX,
				y: e.clientY,
			};
		}
	}, []);

	const get15XRemoveNumCell = (cellId: string, remNum: number) => {
		//id名を1.5倍にして（Aを引いて）戻す  "2em" -> "3em" ->0.5em引く "2.5em"
		const timesNum: number = 1; //1.5倍はやめる

		let num;
		try {
			num = cellId.match(/^([1-9]\d*|0)(\.\d+)?/);
		} catch (error) {}
		let reNum;
		let unit;
		if (num) {
			reNum = Number(num[0]) * timesNum - remNum;
			unit = cellId.replace(num[0], "");
			if (unit === "fr") {
				return cellId;
			} else {
				return `${reNum}${unit}`;
			}
		} else {
			return cellId;
		}
	};

	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////二次配列のコピー///////////////
	const arrChildCopy = <T>(arr: T[][]) => {
		const result: T[][] = [];
		try {
			arr.forEach((child) => {
				const childArr: T[] = [];
				child.forEach((cell) => {
					childArr.push({ ...cell });
				});
				result.push([...childArr]);
				// result.push([...child]);
			});
			return result;
		} catch (error) {
			return;
		}
	};
	///////////////二次配列のコピー///////////////
	///////////////////////////////////////////
	///////////////////////////////////////////

	///////////////////////////////////////////
	///////////////////////////////////////////
	////////////数値と単位（rem）を分離///////////
	const splitNumUnitToArr = (str: string): [number, string] => {
		//単位つき数を分割する　5em -> [5,"em"]
		//数値がない場合は[0,string]をreturn
		if (!str) {
			return;
		}

		const num = str.match(/^([1-9]\d*|0)(\.\d+)?/);

		let reNum;
		let unit;
		if (num) {
			reNum = Number(num[0]);
			unit = str.replace(num[0], "");
			return [reNum, unit];
		} else {
			return [1, unit];
		}
	};
	////////////数値と単位（rem）を分離///////////
	///////////////////////////////////////////
	///////////////////////////////////////////

	const getSameStyleList = (styleName: string) => {
		const tagArr = getMenuTagArr();
		const tagRow = tagArr.flatMap((tags) => (tags.includes(styleName) ? tags : []));

		return tagRow;
	};

	const removeSameTag = (arr1: string[], arr2: string[]) => {
		//arr1からarr2の要素を取り除く

		const baseArr = arr1.flatMap((d) => (arr2.includes(d) ? [] : d));
		// const baseArr = [...arr1];
		// const rmArr = [...arr2];
		// for (const s in baseArr) {
		// 	for (const v in rmArr) {
		// 		if (baseArr[s] === rmArr[v]) {
		// 			baseArr.splice(Number(s), 1);
		// 		}
		// 	}
		// }
		return baseArr;
	};

	const getRandomkey = (keyset: string, num: number) => {
		const rndStr = new Array(num)
			.fill("")
			.map(() => keyset[Math.floor(Math.random() * keyset.length)])
			.join("");

		return rndStr;
	};

	const cellDataToTempAreaStr = (newCellData: TableCellData[][]) => {
		const nCell = newCellData.map((row) => `"${row.map((cell) => cell.label).join(" ")}"`).join(" ");
		return nCell;
	};

	const handleImportTable = async (id: string, isDuplicateRaw = false) => {
		let isDuplicate = isDuplicateRaw;
		const _table = await getAllTables({});
		const _table_readOnly = await getAllTables_readOnly({});

		let nTable: TableType;

		const table = _table.find((d) => d.id === id);
		const table_readOnly = _table_readOnly.find((d) => d.id === id);

		if (table) {
			nTable = table;
		} else if (table_readOnly) {
			nTable = table_readOnly;
			isDuplicate = true;
		} else {
			console.log("データベースと一致しませんでした");
			return "error";
		}

		const rowLength = nTable.templateRows.length;
		const columnLength = nTable.templateColumns.length;

		let count = 0;
		let countCol = 0;
		let countRow = 0;

		const cells = [];

		while (countCol < rowLength) {
			const row = [];
			while (countRow < columnLength * (countCol + 1)) {
				if (nTable.cellData.length > countRow) {
					row.push({ ...nTable.cellData[count] });
				}
				countRow++;
				count++;
			}
			cells.push(row);
			countCol++;
		}

		let nId = id;
		let nTitle = nTable.tableTitle;

		//複製の場合titleとidを変更
		if (isDuplicate) {
			nId = autoID();
			nTitle = `${nTable.tableTitle}（コピー）`;
		}

		setIdState(nId);
		setTableReadOnly(nTable.readOnly);
		setCellData(cells);
		setTableTitle(nTitle);
		setTemplateAreas(nTable.templateAreas);
		setTemplateColumns(nTable.templateColumns);
		setTemplateRows(nTable.templateRows);
		setTableCreatedAt(nTable.createdAt);
		setTableUpdatedAt(nTable.updatedAt);
	};

	const getExportTableData = (nTableId: string, cellData: TableCellData[][]) => {
		//
		const newCellData = arrChildCopy(cellData);

		const addUnitArr = (arr: string[]) => {
			const num: number[] = [];
			const unit: string[] = [];

			const innerWidth = arr
				.map((d) => {
					return splitNumUnitToArr(d);
				})
				.reduce(
					(acc: [string, string], val, index) => {
						return [acc[0] + val[0], val ? val[1] : acc[1]];
					},
					[0, ""],
				);

			return innerWidth;
		};

		const innerWidth = addUnitArr(templateColumns);

		const props: TableType = {
			id: nTableId === "" ? idState : nTableId,
			readOnly: tableReadOnly,
			cellData: cellData.flat(),
			templateAreas: templateAreas,
			templateColumns: templateColumns,
			templateRows: templateRows,
			innerWidth: [String(innerWidth[0]), String(innerWidth[1])],
			tableTitle: tableTitle,
			createdAt: "",
			updatedAt: "",
		};

		return props;
	};

	const handleInsertCell = ({ id, dir }: { id: string; dir: string }) => {
		let num: number;

		////////////////////////////
		// numは挿入する境目を指す(一番左は0番目)
		/////////////////////////////

		const insertCell = (cellData: TableCellData[][], num: number, dir: string) => {
			//
			const newCell2: TableCellData = {
				id: "0000",
				label: "0000",
				textField: "",
				format: "normal",
				style: "",
				border: "",
			};

			if (dir === "col") {
				////////////1個づつずらす///////////////////////

				const newCellData = cellData.map((row: TableCellData[], index1: number) => {
					const _nRow = [...row];
					_nRow.splice(num, 0, { ...newCell2 });
					const nRow = _nRow.map((cell: TableCellData, index2: number) => {
						const nId = alphabet[index2] + `000${index1 + 1}`.slice(-3);
						cell.id = nId;
						if (cell.label.length === 4) {
							//labelが4桁ではない場合（セルが結合しているので）labelの値を変更しない
							cell.label = nId;
						}
						return cell;
					});

					return nRow;
				});

				return newCellData;
			} else if (dir === "row") {
				////////////1個づつずらす///////////////////////

				cellData.splice(num, 0, null); //追加するrowの場所にnullを挿入する

				const newCellData = cellData.map((rows, rid, arr) => {
					if (!rows) {
						const rowLen = arr[0].length;
						const nRow = new Array(rowLen).fill(null).map((_, id) => {
							const nId = alphabet[id] + `000${Number(rid + 1)}`.slice(-3);
							const newCell = { ...TableCellDataInitObj, id: nId, label: nId };
							return newCell;
						});
						return nRow;
					}
					rows.map((cell, cid) => {
						const idArr = changeCellIdToNumber(cell.id);
						const nId = alphabet[idArr[0]] + `000${Number(rid + 1)}`.slice(-3);

						cell.id = nId;
						if (cell.label.length === 4) {
							cell.label = nId;
						}
						return cell;
					});
					return rows;
				});

				return newCellData;
			} else {
				return;
			}
		};

		const insertTemplateColumns = (num: number, templateColumns: string[]) => {
			templateColumns.splice(num, 0, "10em");
			return templateColumns;
		};

		const insertTemplateRows = (num: number, templateRows: string[]) => {
			templateRows.splice(num, 0, "3em");
			return templateRows;
		};

		if (dir === "left") {
			const idArr = changeCellIdToNumber(id);

			num = idArr[0];
			const nCellData = insertCell(cellData, num, "col");
			const newCell = cellDataToTempAreaStr(nCellData);
			const nCol = insertTemplateColumns(num, templateColumns);
			setCellData(nCellData);
			setTemplateAreas(newCell);
			setTemplateColumns(nCol);
		} else if (dir === "right") {
			const idArr = changeCellIdToNumber(id);

			num = idArr[0] + 1;
			const nCellData = insertCell(cellData, num, "col");
			const newCell = cellDataToTempAreaStr(nCellData);
			const nCol = insertTemplateColumns(num, templateColumns);
			setCellData(nCellData);
			setTemplateAreas(newCell);
			setTemplateColumns(nCol);
		} else if (dir === "top") {
			const idXXXNum = changeCellIdToNumber(id);
			num = Number(idXXXNum[1]);

			const nCellData = insertCell(cellData, num, "row");
			const newCell = cellDataToTempAreaStr(nCellData);
			const nRow = insertTemplateRows(num, templateRows);
			setCellData(nCellData);
			setTemplateAreas(newCell);
			setTemplateRows(nRow);
		} else if (dir === "bottom") {
			const idXXXNum = changeCellIdToNumber(id);

			num = Number(idXXXNum[1]) + 1;

			const nCellData = insertCell(cellData, num, "row");

			const newCell = cellDataToTempAreaStr(nCellData);
			const nRow = insertTemplateRows(num, templateRows);

			setCellData(nCellData);
			setTemplateAreas(newCell);
			setTemplateRows(nRow);
		} else {
			return;
		}
	};

	const handleMergeCell = ({ id, dir, cellData }: { id: string; dir: string; cellData: TableCellData[][] }) => {
		//
		const cellCopyWithoutId = (
			cellData: TableCellData[][],
			masterCell: TableCellData,
			nextLabel: string,
			newLabel: string,
		) => {
			// label名のついているセルをmasterCellの内容にコピー、ただし、id名は除く
			const nCellData = cellData.map((row) =>
				row.map((cell) => {
					if (cell.label === masterCell.label) {
						return {
							...cell,
							label: newLabel,
						};
					} else if (cell.label === nextLabel) {
						return {
							...masterCell,
							id: cell.id,
							label: newLabel,
						};
					}
					return cell;
				}),
			);

			return nCellData;
		};

		let newCellData: TableCellData[][];
		const num = changeCellIdToNumber(id);

		const { border, format, label, style, textField }: TableCellData = cellData[num[1]][num[0]];

		const newLabel = getRandomkey(alphabet, 8); //8桁のランダムなキー

		let dirNum: number;
		//右に結合する場合1に、左に結合する場合-1に設定

		if (dir === "left") {
			dirNum = -1;
		} else {
			dirNum = 1;
		}

		//もし結合先がなかった場合return
		if (!cellData[num[1]][num[0] + dirNum]) {
			return;
		}

		//指定しているセルが孤立している場合
		if (label.length !== 8) {
			const nextLabel = cellData[num[1]][num[0] + dirNum].label;
			const master = cellData[num[1]][num[0]];
			newCellData = cellCopyWithoutId(cellData, master, nextLabel, newLabel);
		} else {
			//指定しているセルが結合している場合
			let f = 1;
			while (true) {
				const nextLabel = cellData[num[1]][num[0] + f * dirNum].label;
				if (nextLabel !== label) {
					const master = cellData[num[1]][num[0]];

					newCellData = cellCopyWithoutId(cellData, master, nextLabel, newLabel);
					break;
				} else {
					f++;
				}
			}
		}
		setCellData(newCellData);
		const newTempAreaStr = cellDataToTempAreaStr(newCellData);
		setTemplateAreas(newTempAreaStr);
	};

	const handleUnmergeCell = ({ id, dir, cellData }: { id: string; dir: string; cellData: TableCellData[][] }) => {
		//

		const num = changeCellIdToNumber(id);

		const label = cellData[num[1]][num[0]].label;
		if (label.length !== 8) {
			// lebelの文字数が8個ではなかったら結合ではないのでreturn
			return;
		}

		let isFirseCell = true;
		const newCellData = cellData.map((row) =>
			row.map((cell) => {
				if (cell.label === label) {
					cell.label = cell.id;
					if (isFirseCell) {
						isFirseCell = false;
					} else {
						cell.format = "normal";
						cell.textField = "";
					}
				}
				return cell;
			}),
		);

		setCellData(newCellData);
		const newCell = cellDataToTempAreaStr(newCellData);
		setTemplateAreas(newCell);
	};

	const handleDeleteCell = ({ id }: { id: string }) => {
		const idArr = changeCellIdToNumber(id);

		if (idArr[1] === -1) {
			//colmunセルを削除

			const nCellData = cellData.map((row, rid) =>
				row.flatMap((cell, cid) => {
					if (cid === idArr[0]) {
						return [];
					} else if (cid > idArr[0]) {
						const nId = `${alphabet[cid - 1]}00${String(rid + 1).slice(-2)}`;
						const nLabel = cell.label.length === 4 ? nId : cell.label;
						return { ...cell, id: nId, label: nLabel };
					} else {
						return cell;
					}
				}),
			);

			setCellData(nCellData);
			const newCell = cellDataToTempAreaStr(nCellData);
			const nColCell = templateColumns.filter((cell, index) => index !== idArr[0]);
			setTemplateAreas(newCell);
			setTemplateColumns(nColCell);
		} else {
			//rowセルを削除
			const nCellData = cellData.filter((cell, index) => index !== idArr[1]);
			setCellData(nCellData);
			const newCell = cellDataToTempAreaStr(nCellData);
			const nRowCell = templateRows.filter((cell, index) => index !== idArr[1]);
			setTemplateAreas(newCell);
			setTemplateRows(nRowCell);
		}
	};

	const handleSetCellWidthAuto = async ({ id }: { id: string }) => {
		const idArr = changeCellIdToNumber(id);
		const colNum: number = Number(idArr[0]);

		const templateC = [...templateColumns];

		templateC[colNum] = templateC[colNum] === "auto" ? "5em" : "auto";

		let result;
		const nArr1 = templateC.flatMap((cell, index) => {
			let nCell = get15XRemoveNumCell(cell, edgeW[0]);
			if (index === 0 || index === templateColumns.length - 1) {
				nCell = get15XRemoveNumCell(cell, edgeW[0] / 2);
			}

			if (index === templateColumns.length - 1) {
				result = [nCell, `${edgeW[0] / 2}${edgeW[1]}`];
			} else {
				result = [nCell, edgeW.join("")];
			}

			return result;
		});

		setTemplateColumns(templateC);
		setTopCellColmns(nArr1.join(" "));
	};

	const handleInputText = (e: ChangeEvent<HTMLInputElement>, id: string, label: string) => {
		const nCellData: TableCellData[][] = arrChildCopy(cellData);

		const [rNum, cNum] = changeCellIdToNumber(id);
		nCellData[cNum][rNum].textField = e.target.value;

		setCellData(nCellData);
	};

	const handleChangeStyle = (tag: string) => {
		const cells = arrChildCopy(cellData);
		if (Array.isArray(cells) && !cells[0]) {
			return;
		}
		if (!selectedCell) {
			return;
		}

		const numArr = changeCellIdToNumber(selectedCell);
		const beforeCell = cells[numArr[1]][numArr[0]];

		const cellStyleArr = beforeCell.style.replace(/\s/g, "").split(",");

		const sameStyleListArr = getSameStyleList(tag);

		const newArr = removeSameTag(cellStyleArr, sameStyleListArr);

		newArr.push(tag);

		const newStyle = newArr.join(",");
		beforeCell.style = newStyle;

		setCellData(cells);
	};

	const handleChangeFormat = (tag: TableFormat) => {
		const cells = arrChildCopy(cellData);
		if (Array.isArray(cells) && !cells[0]) {
			return;
		}
		if (!selectedCell) {
			return;
		}
		const numArr = changeCellIdToNumber(selectedCell);
		const beforeCell = cells[numArr[1]][numArr[0]];
		beforeCell.format = tag;

		setCellData(cells);
	};

	return {
		edgeName,
		edgeW,

		handleOnDrag,
		handleOnDragStart,

		idState,
		setIdState,

		tableReadOnly,
		setTableReadOnly,
		tableTitle,
		setTableTitle,
		topCellAreas,
		setTopCellAreas,
		topCellColmns,
		setTopCellColmns,
		sideCellAreas,
		setSideCellAreas,
		sideCellRows,
		setSideCellRows,
		cellData,
		setCellData,
		templateAreas,
		setTemplateAreas,
		templateColumns,
		setTemplateColumns,
		templateRows,

		setTemplateRows,
		tableCreatedAt,
		setTableCreatedAt,
		tableUpdatedAt,
		setTableUpdatedAt,

		thumbImageUrlState,
		setThumbImageUrlState,

		anchorElContextMenu,
		setAnchorElContextMenu,

		// changeTrigger,
		// setChangeTrigger,
		// tableFormats,
		// setTableFormats,
		// tableStyles,
		// setTableStyles,
		selectedCell,
		setSelectedCell,

		handleImportTable,
		// handleExportTable,
		getExportTableData,

		// handleSetSelectedCell,
		// handleContextMenu,
		// handleClose,

		handleSetCellWidthAuto,
		handleInputText,
		handleInsertCell,
		handleDeleteCell,
		handleMergeCell,
		handleUnmergeCell,
		handleChangeStyle,
		handleChangeFormat,
		splitNumUnitToArr,
		changeCellIdToNumber,
	};
};
