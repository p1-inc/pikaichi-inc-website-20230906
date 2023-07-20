import React, { useState, useEffect, useRef } from "react";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { c, cArr } from "../../styles/eStyle";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import {
	ActionIcon,
	Box,
	Button,
	Container,
	CopyButton,
	CSSObject,
	Flex,
	Group,
	HoverCard,
	Stack,
	Switch,
	Tooltip,
} from "@mantine/core";

type AdminSubHeaderType = {
	idState?: string;
	checked?: string[];
	handleBack?: any;
	handleEdit?: any;
	handleDelete?: any;
	handleDuplicate?: any;
	handleSave?: any;
	handleSaveAs?: any;
	handleSetNew?: any;
	handlePreview?: any;
	handleDispHelp?: any;

	displayPreview?: any;
	setDisplayPreview?: any;
	saveLoading?: boolean;
	deleteLoading?: boolean;
};
export const AdminSubHeader = ({
	idState,
	checked,
	handleBack,
	handleEdit,
	handleDelete,
	handleDuplicate,
	handleSave,
	handleSaveAs,
	handleSetNew,
	handleDispHelp,

	displayPreview,
	setDisplayPreview,
	saveLoading,
	deleteLoading,
}: AdminSubHeaderType) => {
	// saveボタンを押したか、saveAsを押したか判別しないとloading 表示ができない  true=save  false=saveAs
	const [isClickSave, setIsClickSave] = useState<boolean>(false);
	const [isClickSaveAs, setIsClickSaveAs] = useState<boolean>(false);

	// const isDisable = () => {
	// 	let result = false;
	// 	if (checked && checked.length < 1) {
	// 		result = true;
	// 	}
	// 	return result;
	// };

	const mainContainer: CSSObject = {
		justifyContent: "space-between",
		borderBottom: `1px solid ${cArr.gray[1]}`,
		width: "100%",
		height: "3em",
		backgroundColor: "#FFF",
	};
	return (
		<Flex sx={mainContainer}>
			<Flex w="90%" m="0 auto" align="center" justify="space-between">
				<Group w="8em" sx={{ flexShrink: 0 }}>
					{idState && (
						<HoverCard offset={-10} position="right" shadow="md" openDelay={100} styles={{ dropdown: { padding: 0 } }}>
							<HoverCard.Target>
								<Flex fz="0.8em" align="center">
									ID: {idState.slice(0, 8)}
								</Flex>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<CopyButton value={idState}>
									{({ copied, copy }) => (
										<Button w="27em" size="xs" color={copied ? "teal" : "blue"} onClick={copy}>
											{copied ? "Copied!" : idState}
										</Button>
									)}
								</CopyButton>
							</HoverCard.Dropdown>
						</HoverCard>
					)}
				</Group>

				<Group sx={{ display: "flex" }}>
					<Flex gap="xs">
						{handleBack && (
							<Flex>
								<Button size="xs" w="11em" variant="outline" onClick={handleBack}>
									<KeyboardReturnIcon />
									<Box ml="0.5em">戻 る</Box>
								</Button>
							</Flex>
						)}

						{handleDispHelp !== undefined && (
							<Button
								size="xs"
								variant="outline"
								onClick={() => {
									handleDispHelp();
								}}
							>
								<HelpOutlineIcon />
								ヒント
							</Button>
						)}

						{displayPreview !== undefined && (
							<Switch
								sx={{ display: "flex", alignItems: "center" }}
								checked={displayPreview}
								onChange={() => {
									setDisplayPreview(!displayPreview);
								}}
								label="プレビュー"
								styles={{ label: { color: c.mainBlack, paddingLeft: "0.3em" } }}
							/>
						)}

						{handleEdit && (
							<Button
								size="xs"
								w="8em"
								variant="outline"
								onClick={() => {
									handleEdit();
								}}
							>
								編 集
							</Button>
						)}

						{handleDelete && (
							<Button
								size="xs"
								w="8em"
								variant="outline"
								onClick={() => {
									handleDelete(checked);
								}}
								loading={deleteLoading ? true : false}
							>
								削 除
							</Button>
						)}

						{handleDuplicate && (
							<Button
								size="xs"
								w="8em"
								variant="outline"
								onClick={() => {
									handleDuplicate();
								}}
							>
								複 製
							</Button>
						)}

						{handleSetNew && (
							<Button
								size="xs"
								w="8em"
								variant="outline"
								onClick={() => {
									handleSetNew();
								}}
							>
								新 規
							</Button>
						)}

						{handleSaveAs && (
							<Button
								size="xs"
								w="13em"
								variant="outline"
								onClick={() => {
									setIsClickSaveAs(true);
									handleSaveAs();
								}}
								loading={saveLoading && isClickSaveAs ? true : false}
							>
								別IDで保存（複製）
							</Button>
						)}

						{handleSave && (
							<Button
								size="xs"
								w="8em"
								variant="filled"
								onClick={() => {
									setIsClickSave(true);
									handleSave();
								}}
								loading={saveLoading && isClickSave ? true : false}
							>
								保 存
							</Button>
						)}
					</Flex>
				</Group>
			</Flex>
		</Flex>
	);
};
