import { useEffect, useState } from "react";
import Head from "next/head";

import { useRouter } from "next/router";

import { deleteTable, getAllTables, getAllTables_readOnly, getAllComponent, getlayoutUsage } from "../../../firebase/firebase";

import { AdminHeader } from "../adminHeader";

import { c, cArr } from "../../../styles/eStyle";

import { CompListType, TableType } from "../../../types/types";

import { useDialogState } from "../../../hooks/useDialogState";

import TableListComp from "./tableListComp";
import { AdminSubHeader } from "../adminSubHeader";

import { Box, Button, Flex, Modal } from "@mantine/core";

export default function TableList() {
	//
	const componentName = "表組の管理";

	const router = useRouter(); //useRouterフックを定義
	const [reload, setReload] = useState<boolean>(false);
	const [tableData_readOnly, setTableData_readOnly] = useState<TableType[]>([]);
	const [tableData, setTableData] = useState<TableType[]>([]);
	const [checked, setChecked] = useState<string[]>([]);

	const [displayTemplate, setDisplayTemplate] = useState<boolean>(false);

	const [thumb, setThumb] = useState<CompListType[]>([]);
	const [thumb_readOnly, setThumb_readOnly] = useState<CompListType[]>([]);

	const { displayAlert, displayConfirm, displayBigDialog } = useDialogState();

	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

	useEffect(() => {
		const f = async () => {
			const tables = await getAllTables({});
			console.log("tables : ", tables);
			const tables_readOnly = await getAllTables_readOnly({});
			console.log("tables_readOnly: ", tables_readOnly);

			const nArr = tables.sort((a: TableType, b: TableType) => {
				const a1 = a.updatedAt.replace(/-/g, "");
				const b1 = b.updatedAt.replace(/-/g, "");
				return a1 > b1 ? -1 : 1;
			});

			const nArr_readOnly = tables_readOnly.sort((a: TableType, b: TableType) => {
				return a.id > b.id ? -1 : 1;
			});

			setTableData(nArr);
			setTableData_readOnly(nArr_readOnly);

			const _thumb = await getAllComponent({});
			const thumb = _thumb.filter((d) => d.blockName === "table");
			const thumb_readOnly = _thumb.filter((d) => d.blockName === "table_readOnly");

			setThumb(thumb);
			setThumb_readOnly(thumb_readOnly);
		};

		f();
	}, [reload]);

	const handleSetNew = () => {
		router.push("/admin/editTable?dup=true&id=_template_default");
	};

	const handleEdit = async (id: string) => {
		//
		let selTable: string;
		if (id) {
			selTable = id;
		} else if (!id && checked.length === 1) {
			selTable = checked[0];
		} else if (!id && checked.length > 1) {
			await displayAlert("", "編集する際は１つだけ選択してください", "");
			return;
		} else {
			return;
		}

		router.push(`/admin/editTable/?id=${selTable}`);
	};

	const handleDuplicate = async () => {
		//
		if (checked.length > 1) {
			await displayAlert("", "１つだけ選択してください", "");
			return;
		}

		router.push(`/admin/editTable/?dup=true&id=${checked[0]}`);
	};

	const handleDelete = async (idArr: string[]) => {
		if (checked.length < 1) {
			return;
		}

		const isUsageFromDB = await getlayoutUsage();

		const _usageList = idArr.flatMap((d) => {
			const isIncludeArr = isUsageFromDB.flatMap((d2) => {
				const isIncludes = d2.includes(d);
				return isIncludes ? d2 : [];
			});
			return isIncludeArr;
		});

		const usageList: [string, string[]][] = _usageList.map((d) => {
			const id = d.replace(/^.*_/, "").slice(0, 8);
			return [id, ["【レイアウトで使用されています】"]];
		});

		const headCells = [
			{
				id: "id",
				label: "ID",
				width: "20em",
			},
			{
				id: "usage",
				label: "使用状況",
				width: "50em",
			},
		];

		if (usageList.length > 0) {
			const isConfirm = await displayBigDialog(
				"",
				"選択されたコンポーネントはレイアウトで使用しています。\nレイアウトから除外してからもう一度削除してください",
				headCells,
				usageList,
			);
			return;
		}

		const isConfirm = await displayConfirm("", "このデータを削除しますか？", "");

		if (!isConfirm) {
			return;
		}

		setDeleteLoading(true);

		try {
			const result = await deleteTable(idArr);

			if (result === "success") {
				await displayAlert("", "データを削除しました", "");
				setChecked([]);
			} else {
				await displayAlert("", "データの削除に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}

		setDeleteLoading(false);
		router.reload();
	};

	return (
		<div>
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<AdminSubHeader
				checked={checked}
				handleSetNew={handleSetNew}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				handleDuplicate={handleDuplicate}
				deleteLoading={deleteLoading}
			/>

			<Flex w="90%" m="0 auto" mt="1em" align="center">
				<Button
					variant="outline"
					onClick={() => {
						setDisplayTemplate(!displayTemplate);
					}}
				>
					テンプレートを表示
				</Button>
			</Flex>

			<Modal
				opened={displayTemplate}
				onClose={() => setDisplayTemplate(false)}
				size="90%"
				title="テンプレート"
				styles={{
					header: {
						paddingBottom: "0.5em",
						borderBottom: `1px solid ${cArr.gray[8]}`,
						zIndex: 10000,
					},
				}}
			>
				<Flex wrap="wrap" sx={{ paddingBottom: "2em" }}>
					<TableListComp checked={checked} setChecked={setChecked} tableData={tableData_readOnly} thumb={thumb_readOnly} handleEdit={handleEdit} />
				</Flex>
				<Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
					<Button disabled={checked.length < 1 ? true : false} onClick={handleDuplicate}>
						テンプレートを開く
					</Button>
				</Box>
			</Modal>

			<Flex w="90%" m="0 auto" mt="1em" p="1em" wrap="wrap">
				<TableListComp checked={checked} setChecked={setChecked} tableData={tableData} thumb={thumb} handleEdit={handleEdit} />
			</Flex>
		</div>
	);
}
