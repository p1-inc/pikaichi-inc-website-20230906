import { useEffect, useState, Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { getAllUserList } from "../../../firebase/firebase";
import { AdminHeader } from "../adminHeader";
import { UserType } from "../../../types/types";
import { useDialogState } from "../../../hooks/useDialogState";
import { AdminSubHeader } from "../adminSubHeader";
import { useTableElement } from "../../../hooks/useTableElement";

import { cArr } from "../../../styles/eStyle";

import { Table, Text, Box, Flex, Checkbox, Pagination, Anchor, ScrollArea } from "@mantine/core";

import { ThComponent } from "../../commonComponents/listComponent";

const minWidth = "1000px";

type HeadCellsType = {
	id: keyof UserType;
	label: string;
	width: string;
};

const headCells: HeadCellsType[] = [
	{
		id: "id",
		label: "ID",
		width: "6em",
	},
	{
		id: "displayName",
		label: "名前",
		width: "8em",
	},

	{
		id: "position",
		label: "ポジション",
		width: "6em",
	},

	{
		id: "role",
		label: "権限",
		width: "6em",
	},

	{
		id: "updatedAt",
		label: "更新日",
		width: "8em",
	},
];

const getDateFormatFull = (date: string) => {
	const arr = date.split("-");

	return `${arr[0]}/${arr[1]}/${arr[2]}-${arr[3]}:${arr[4]}:${arr[5]}`;
};

const roleName = {
	admin: "管理者",
	staff: "スタッフ",
	user: "一般",
};

export default function UserList() {
	//
	const componentName = "ユーザーの管理";

	const router = useRouter(); //useRouterフックを定義

	const {
		tableData: userData,
		setTableData: setUserData,
		search,
		setSearch,
		sortBy,
		setSortBy,
		reverseSortDirection,
		setReverseSortDirection,
		page,
		setPage,
		rowsPerPage,
		setRowsPerPage,
		checked,
		setChecked,

		filterData,
		sortData,
		setSorting,
		handleSelectAllClick,
		sortDataFunc,
		handleCheck,
	} = useTableElement<UserType>("updatedAt");

	const { displayAlert, displayConfirm, displayConfirmSaveAs } = useDialogState();

	useEffect(() => {
		const f = async () => {
			const users: UserType[] = await getAllUserList();
			users.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

			setUserData(users);
		};
		f();
	}, []);

	const handleEdit = async (id: string) => {
		let nId: string;
		if (id) {
			nId = id;
		} else {
			if (checked.length > 1) {
				await displayAlert("", "編集する記事は１つにしてください", "");

				return;
			} else if (checked.length === 1) {
				nId = checked[0];
			}
		}
		router.push(`/admin/editUser?id=${nId}`);
	};

	const handleDuplicate = async () => {
		if (checked.length > 1) {
			await displayAlert("", "ユーザーは１つ選択してください", "");
			return;
		}
		router.push(`/admin/editUser/?dup=true&id=${checked[0]}`);
	};

	const handleDelete = async (idArr: string[]) => {
		//         if (checked.length < 1) {
		//             return;
		//         }
		//         try {
		//             const result = await deleteShopInfo({ idArr });
		//
		//             if (result === "success") {
		//                 await displayAlert("", "データを削除しました", "");
		//                 setReload(!reload);
		//             } else {
		//                 await displayAlert("", "データの削除に失敗しました", "red");
		//             }
		//         } catch (error) {
		//             console.log(error);
		//         }
	};

	return (
		<Box w="100%">
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<AdminSubHeader checked={checked} handleEdit={handleEdit} handleDuplicate={handleDuplicate} />

			<ScrollArea>
				<Table
					horizontalSpacing="md"
					verticalSpacing="xs"
					sx={{
						tableLayout: "fixed",
						minWidth: minWidth,
						borderBottom: "1px solid lightGray",
					}}
					striped
					highlightOnHover
				>
					<thead>
						<tr>
							<Box w="3em" component="th">
								<Checkbox
									ml="1em"
									checked={checked.length > 0 && checked.length === userData.length}
									onChange={handleSelectAllClick}
									indeterminate={checked.length > 0 && checked.length < userData.length}
									transitionDuration={0}
								/>
							</Box>

							{headCells.map((h) => (
								<ThComponent key={h.id} sorted={sortBy === h.id} reversed={reverseSortDirection} onSort={() => setSorting(h.id)} width={h.width}>
									{h.label}
								</ThComponent>
							))}
						</tr>
					</thead>
					<tbody>
						{userData.length > 0 ? (
							userData.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage).map((row) => (
								<tr key={row.id}>
									<Box w="3em" component="td">
										<Checkbox
											ml="1em"
											checked={Boolean(checked.find((e) => row.id === e))}
											onChange={() => {
												handleCheck(row.id);
											}}
											transitionDuration={0}
										/>
									</Box>

									<td>
										<Anchor<"a">
											onClick={() => {
												handleEdit(row.id);
											}}
										>
											{row.id?.slice(0, 8)}
										</Anchor>
									</td>
									<td>
										<Anchor<"a">
											onClick={() => {
												handleEdit(row.id);
											}}
										>
											{row.displayName}
										</Anchor>
									</td>
									<td>{row.position || "---"} </td>
									<td>{roleName[row.role] || "---"}</td>
									<td> {getDateFormatFull(row.updatedAt) || "---"}</td>
								</tr>
							))
						) : (
							<tr>
								<td>データがありません</td>
							</tr>
						)}
					</tbody>
				</Table>
			</ScrollArea>
			<Flex mt="1em" mr="1em" align="center" justify="flex-end">
				<Text fz="0.8em" mr="1em">{`全${userData.length}個のデータ`}</Text>
				<Pagination value={page} onChange={setPage} total={Math.ceil(userData.length / rowsPerPage)} size="sm" />
			</Flex>
		</Box>
	);
}
