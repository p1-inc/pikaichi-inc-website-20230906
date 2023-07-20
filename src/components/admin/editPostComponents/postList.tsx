import { useRef, useEffect, useState, Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { deletePostAsIdArr, getAllPostCategory, getAllPostData } from "../../../firebase/firebase";

import { AdminHeader } from "../adminHeader";

import { PostDataType, CategoryType } from "../../../types/types";

import { useDialogState } from "../../../hooks/useDialogState";

import { AdminSubHeader } from "../adminSubHeader";

import { useTableElement } from "../../../hooks/useTableElement";

import { cArr } from "../../../styles/eStyle";

import { Anchor, Box, Center, Checkbox, createStyles, Flex, Group, Pagination, ScrollArea, Table, Text, UnstyledButton } from "@mantine/core";

import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react";
import { ThComponent } from "../../commonComponents/listComponent";

const minWidth = "1000px";

type HeadCellsType = {
	id: keyof PostDataType;
	label: string;
	width: string;
};

const headCells: HeadCellsType[] = [
	{
		id: "id",
		label: "ID",
		width: "8em",
	},
	{
		id: "date",
		label: "日付",
		width: "8em",
	},
	{
		id: "title",
		label: "タイトル",
		width: "15em",
	},
	{
		id: "canPublic",
		label: "公開",
		width: "7em",
	},
	{
		id: "isDraft",
		label: "下書き",
		width: "7em",
	},
	{
		id: "user",
		label: "投稿者",
		width: "10em",
	},
	{
		id: "category",
		label: "カテゴリー",
		width: "10em",
	},
	{
		id: "updatedAt",
		label: "更新日",
		width: "15em",
	},
];

const getDateFormatFull = (date: string) => {
	const arr = date.split("-");
	return `${arr[0]}/${arr[1]}/${arr[2]}-${arr[3]}:${arr[4]}:${arr[5]}`;
};

const getDateFormatYYYYMMMDD = (date: string) => {
	const arr = date.split("-");
	return `${arr[0]}/${arr[1]}/${arr[2]}`;
};

export default function PostList() {
	console.log("PostList: ");
	//
	const componentName = "記事の管理";

	const router = useRouter(); //useRouterフックを定義

	const {
		tableData: postData,
		setTableData: setPostData,
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
	} = useTableElement<PostDataType>("updatedAt");

	const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

	const { displayAlert, displayConfirm, displayBigDialog } = useDialogState();

	useEffect(() => {
		const f = async () => {
			const postData = await getAllPostData();
			const post_category = await getAllPostCategory({});

			postData.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

			setPostData(postData);
			setCategoryList(post_category);
		};

		f();
	}, []);

	const handleSetNew = () => {
		router.push("/admin/editPost/");
	};

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
		router.push(`/admin/editPost?id=${nId}`);
	};

	const handleDuplicate = async () => {
		if (checked.length > 1) {
			await displayAlert("", "編集する記事は１つにしてください", "");

			return;
		}
		router.push(`/admin/editPost/?dup=true&id=${checked[0]}`);
	};

	const handleDelete = async () => {
		if (checked.length < 1) {
			return;
		}

		const isConfirm = await displayConfirm("", "このデータを削除しますか？", "");

		if (!isConfirm) {
			return;
		}

		setDeleteLoading(true);
		try {
			const result = await deletePostAsIdArr(checked);

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

	const getCategoryName = (id: string) => {
		//
		let result: {
			name: string;
			color: string;
		};

		if (id) {
			const res = categoryList.find((cate) => cate.id === id);
			result = { name: res.name, color: res.color };
		} else {
			result = { name: "", color: "" };
		}

		return result;
	};
	return (
		<Box>
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<AdminSubHeader
				checked={checked}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				handleDuplicate={handleDuplicate}
				handleSetNew={handleSetNew}
				deleteLoading={deleteLoading}
			/>

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
									checked={checked.length > 0 && checked.length === postData.length}
									onChange={handleSelectAllClick}
									indeterminate={checked.length > 0 && checked.length < postData.length}
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
						{postData.length > 0 ? (
							postData.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage).map((row) => (
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

									<Text component="td" truncate>
										<Anchor<"a">
											onClick={() => {
												handleEdit(row.id);
											}}
										>
											{row.id?.slice(0, 8)}
										</Anchor>
									</Text>
									<Text component="td" truncate>
										{getDateFormatYYYYMMMDD(row.date)}
									</Text>
									<Text component="td" truncate>
										<Anchor<"a">
											onClick={() => {
												handleEdit(row.id);
											}}
										>
											{row.title}
										</Anchor>
									</Text>

									<Text component="td" truncate>
										{row.canPublic ? "◯" : "✕"}
									</Text>
									<Text component="td" truncate>
										{row.isDraft ? "◯" : "✕"}
									</Text>
									<Text component="td" truncate>
										{row.user.displayName}
									</Text>
									<Text component="td" truncate color={getCategoryName(row.category).color}>
										{getCategoryName(row.category).name}
									</Text>
									<Text component="td" truncate>
										{getDateFormatFull(row.updatedAt) || "---"}
									</Text>
								</tr>
							))
						) : (
							<tr>
								<Box component="td" colSpan={7} ta="center">
									データがありません
								</Box>
							</tr>
						)}
					</tbody>
				</Table>
			</ScrollArea>
			<Flex mt="1em" mr="1em" align="center" justify="flex-end">
				<Text fz="0.8em" mr="1em">{`全${postData.length}個のデータ`}</Text>
				<Pagination value={page} onChange={setPage} total={Math.ceil(postData.length / rowsPerPage)} size="sm" />
			</Flex>
		</Box>
	);
}
