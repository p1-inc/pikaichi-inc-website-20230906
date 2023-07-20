import { useState, useContext, MouseEventHandler } from "react";
import Image from "next/future/image";

import { c } from "../../../../styles/eStyle";

import { Box, Menu, Text } from "@mantine/core";
import { MenuItemsItemType, MenuItemsType } from "./editTableMenuItems";
import { UseEditTableStateType } from "../hooks/useEditTableState";

type EditTableMenuBtnType = {
	type: "style" | "format";
	item: MenuItemsType;
	editTableState: UseEditTableStateType;
};
export const EditTableMenuBtn = ({ type, item, editTableState }: EditTableMenuBtnType) => {
	//
	const { handleChangeStyle, handleChangeFormat } = editTableState;

	type HandleSelectType = { type: "style" | "format"; item: MenuItemsType; data: MenuItemsItemType };
	const handleSelect = ({ type, item, data }: HandleSelectType) => {
		if (type === "style") {
			handleChangeStyle(data.tag);
		}
		if (type === "format") {
			const tag: string = data.tag;
			handleChangeFormat(tag);
		}
	};

	const Item = ({ data, width, height }: { data: MenuItemsItemType; width: string; height: string }) => {
		if ("src" in data) {
			return <Image src={data.src} alt={item.name} width={width} height={height} />;
		} else if ("text" in data) {
			return <Text color={c.mainBlack}>{data.text}</Text>;
		}
	};
	return (
		<Menu shadow="md">
			<Menu.Target>
				<Box>
					<Image src={item.src} alt={item.name} width={item.width} height={item.height} />
				</Box>
			</Menu.Target>
			<Menu.Dropdown>
				{item.items.map((data: MenuItemsItemType) => {
					return (
						<Menu.Item key={data.key} onClick={(e) => handleSelect({ type, item, data })}>
							<Item data={data} width={item.childWidth} height={item.childHeight} />
						</Menu.Item>
					);
				})}
			</Menu.Dropdown>
		</Menu>
	);
};
