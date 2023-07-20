import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import dayjs from "dayjs";

import { setTable, setTableAsTemplate } from "../../../firebase/firebase";

import TableCompEditor from "./tableCompEditor";

import { useDialogState } from "../../../hooks/useDialogState";

import TableComp from "../../subComponents/tableComp";

import { AdminHeader } from "../adminHeader";

import { c } from "../../../styles/eStyle";

import { useEditTableState } from "./hooks/useEditTableState";
import { TableType } from "../../../types/types";
import { AdminSubHeader } from "../adminSubHeader";
import { autoID } from "../../../util/autoID";
import { Box, CSSObject } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";

//TODO セルを自動幅に設定している場合、それを戻す機能がない、自動幅の設定がautoなのか1frなのか、、統一する
//TODO セルのコピー機能をつけたい
export default function EditTable({ id, isDuplicate }: { id: string; isDuplicate: boolean }) {
	//
	const componentName = "表組の管理";

	const router = useRouter(); //useRouterフックを定義

	const [toMaketThumbRef, rootRect] = useResizeObserver();

	const { displayAlert, displayConfirm, displayConfirmSaveAs } = useDialogState();

	const [saveLoading, setSaveLoading] = useState<boolean>(false);

	const editTableState = useEditTableState();

	const {
		idState,
		setIdState,
		tableTitle,
		setTableTitle,
		handleImportTable,
		getExportTableData,
		cellData,
		tableCreatedAt: createdAt,
		setTableCreatedAt: setCreatedAt,
		tableUpdatedAt: updatedAt,
		setTableUpdatedAt: setUpdatedAt,
	} = editTableState;

	useEffect(() => {
		if (id) {
			setIdState(id);
			handleImportTable(id, isDuplicate);
		}
	}, [id]);

	const editArea: CSSObject = {
		label: "editArea",
		width: "95%",
		margin: "0 auto",
		overflow: "hidden",
	};

	const previewContainer: CSSObject = {
		label: "previewContainer",
		display: cellData.length === 0 ? "none" : "block",
		width: "100%",
		paddingBottom: "2em",
		backgroundColor: "#ffe",
		border: `10px solid ${c.skyblue}`,
		borderTop: "none",
	};

	const previewTitle: CSSObject = {
		label: "previewTitle",
		textAlign: "center",
		backgroundColor: c.skyblue,
		color: "#fff",
	};

	const preview: CSSObject = {
		label: "preview",
		width: "80%",
		margin: "0 auto",
		marginTop: "1em",
	};

	const editTableContainer: CSSObject = {
		label: "editTableContainer",
		width: "100%",
	};

	const previewWrapper: CSSObject = {
		margin: "4em auto",
		width: "700px",
	};

	const handleSaveAs = async (id: string = idState) => {
		const nId = autoID();
		const isConfirm = await displayConfirm("", `別IDとして保存します。  新ID : ${nId.slice(0, 8)}`, "");
		if (!isConfirm) {
			return;
		}

		handleSave(nId);
	};

	const handleSave = async (nId: string = idState) => {
		//nId:テーブルのid、overWriteは可or不可

		let tmpCreatedAt;
		let tmpUpdatedAt;

		const now = dayjs();

		if (!createdAt || createdAt === "") {
			const day = now.format("YYYY-MM-DD-HH-mm-ss");
			tmpCreatedAt = day;
			tmpUpdatedAt = day;
		} else {
			tmpCreatedAt = createdAt;
			tmpUpdatedAt = now.format("YYYY-MM-DD-HH-mm-ss");
		}

		const exportData = getExportTableData(nId, cellData);

		const data: TableType = {
			...exportData,
			createdAt: tmpCreatedAt,
			updatedAt: tmpUpdatedAt,
		};

		setSaveLoading(true);

		try {
			const result = await setTable(
				data,
				toMaketThumbRef.current,
				rootRect.width,
				rootRect.height,
				tmpCreatedAt,
				tmpUpdatedAt,
			);
			if (result === "success") {
				await displayAlert("", "保存しました", "");
			} else {
				await displayAlert("", "保存に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		setSaveLoading(false);
		router.push(`/admin/editTable/?id=${nId}`);
	};

	const handleBack = async () => {
		router.push("/admin/tableList/");
	};

	const tableData: TableType = {
		id: editTableState.idState,
		readOnly: false,
		cellData: editTableState.cellData.flat(),
		templateAreas: editTableState.templateAreas,
		templateColumns: editTableState.templateColumns,
		templateRows: editTableState.templateRows,
		innerWidth: [],
		tableTitle: editTableState.tableTitle,
		createdAt: "",
		updatedAt: "",
	};
	return (
		<Box sx={editTableContainer}>
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />
			<AdminSubHeader
				idState={idState}
				handleBack={handleBack}
				handleSave={handleSave}
				handleSaveAs={handleSaveAs}
				saveLoading={saveLoading}
			/>

			<Box sx={previewContainer}>
				<Box sx={previewTitle}>プレビュー</Box>

				<Box sx={previewWrapper}>
					<Box ref={toMaketThumbRef}>
						<TableComp tableData={tableData} />
					</Box>
				</Box>
			</Box>

			<Box sx={editArea}>
				<TableCompEditor editTableState={editTableState} />
			</Box>
		</Box>
	);
}
