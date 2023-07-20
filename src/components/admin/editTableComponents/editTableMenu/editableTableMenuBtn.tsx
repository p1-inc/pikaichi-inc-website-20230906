import React, { useState } from "react";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Menu, UnstyledButton } from "@mantine/core";

// import { EditTableMenuProps } from "./editTableMenu";
type EditableTableMenuBtnType = {
	type: string;
	id: string;
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
	handleSetCellWidthAuto: ({
		id,
	}: {
		id: string;
	}) => Promise<void>;
};

export const EditableTableMenuBtn = ({
	type,
	id,
	handleInsertCell,
	handleDeleteCell,
	handleSetCellWidthAuto,
}: EditableTableMenuBtnType) => {
	// const [anchorEl, setAnchorEl] = useState(null);

	const [openMenu, setOpeneMenu] = useState<string[]>([]);

	const items = (type: string) => {
		let result: { key: string; dir: string; handle: string; text: string }[];
		if (type === "left_right") {
			result = [
				{
					key: "insertRightCell",
					dir: "right",
					handle: "insert",
					text: "右側にセルを挿入",
				},
				{
					key: "insertLeftCell",
					dir: "left",
					handle: "insert",
					text: "左側にセルを挿入",
				},
				{
					key: "deleteThisCell",
					dir: "this",
					handle: "delete",
					text: "このセルを削除",
				},
				{
					key: "setCellWidthAuto",
					dir: "this",
					handle: "cellWidthAuto",
					text: "このセル幅を自動に設定",
				},
			];
		} else {
			result = [
				{
					key: "insertBottomCell",
					dir: "bottom",
					handle: "insert",
					text: "下側にセルを挿入",
				},
				{
					key: "insertTopCell",
					dir: "top",
					handle: "insert",
					text: "上側にセルを挿入",
				},
				{
					key: "deleteThisCell",
					dir: "this",
					handle: "delete",
					text: "このセルを削除",
				},
			];
		}

		return result;
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

	const handleFunc = ({ id, dir, handle }: { id: string; dir: string; handle: string }) => {
		if (handle === "insert") {
			handleInsertCell({ id, dir });
		} else if (handle === "delete") {
			handleDeleteCell({ id });
		} else if (handle === "cellWidthAuto") {
			handleSetCellWidthAuto({ id });
		} else {
			return;
		}
	};

	return (
		<>
			<Menu
				shadow="md"
				width={200}
				opened={openMenu.includes(id)}
				onClose={() => {
					handleContextCloseMenu(id);
				}}
			>
				<Menu.Target>
					<UnstyledButton
						sx={{ display: "flex", justifyContent: "center" }}
						onClick={(e) => {
							handleContextOpenMenu(e, id);
						}}
					>
						<AddBoxOutlinedIcon style={{ color: "#FFF" }} />
					</UnstyledButton>
				</Menu.Target>
				<Menu.Dropdown>
					{items(type).map((item) => {
						return (
							<Menu.Item key={item.key} onClick={(e) => handleFunc({ id, dir: item.dir, handle: item.handle })}>
								{item.text}
							</Menu.Item>
						);
					})}
				</Menu.Dropdown>
			</Menu>
		</>
	);
};
