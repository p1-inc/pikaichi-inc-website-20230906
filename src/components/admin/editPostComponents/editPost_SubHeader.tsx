import React, { useState, useEffect, useRef, forwardRef, Dispatch, SetStateAction } from "react";

import { CategoryType } from "../../../types/types";

import { useDialogState } from "../../../hooks/useDialogState";

import CircleIcon from "@mui/icons-material/Circle";
import {
	Checkbox,
	Tooltip,
	Chip,
	Select,
	Group,
	Flex,
	Container,
	Button,
	Modal,
	Textarea,
	Text,
	Stack,
	Box,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";
import "dayjs/locale/ja";

import { IconHelp } from "@tabler/icons-react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { c, cArr } from "../../../styles/eStyle";
import dayjs from "dayjs";

type ItemProps = {
	value: string;
	color: string;
	name: string;
	label: string;
};
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, label, color, name, ...others }, ref) => (
	<div ref={ref} {...others} key={value}>
		<Group noWrap>
			<CircleIcon sx={{ color: color }} />
			{label}
		</Group>
	</div>
));
SelectItem.displayName = "SelectItem";

type EditPost_SubHeaderType = {
	id: string;
	dateState: dayjs.Dayjs | Date;
	handleDate: (value: dayjs.Dayjs | Date) => void;
	pin: boolean;
	setPin: Dispatch<SetStateAction<boolean>>;
	canPublic: boolean;
	setCanPublic: Dispatch<SetStateAction<boolean>>;
	isDraft: boolean;
	setIsDraft: Dispatch<SetStateAction<boolean>>;
	categoryState: string;
	setCategoryState: Dispatch<SetStateAction<string>>;
	categoryList: CategoryType[];
	metaTitle: string;
	setMetaTitle: Dispatch<SetStateAction<string>>;
	metaDescription: string;
	setMetaDescription: Dispatch<SetStateAction<string>>;
};
export const EditPost_SubHeader = ({
	id,
	dateState,
	handleDate,
	pin,
	setPin,
	canPublic,
	setCanPublic,
	isDraft,
	setIsDraft,
	categoryState,
	setCategoryState,
	categoryList,
	metaTitle,
	setMetaTitle,
	metaDescription,
	setMetaDescription,
}: EditPost_SubHeaderType) => {
	//
	const [openMetaEditor, setOpenMetaEditor] = useState<boolean>(false);

	const [tmpMetaTitle, setTmpMetaTitle] = useState<string>(metaTitle);
	const [tmpMetaDescription, setTmpMetaDescription] = useState<string>(metaDescription);

	const { displayAlert } = useDialogState();

	useEffect(() => {
		setTmpMetaTitle(metaTitle);
		setTmpMetaDescription(metaDescription);
	}, [metaTitle, metaDescription]);

	const setMetaData = async () => {
		setMetaTitle(tmpMetaTitle);
		setMetaDescription(tmpMetaDescription);
		await displayAlert("", "保存しました", "");
		setOpenMetaEditor(false);
	};

	let nDate = new Date();
	if (dateState) {
		nDate = new Date(String(dateState));
	}

	return (
		<Flex w="100%" h="4em" align="center" sx={{ borderBottom: "1px solid #ababab", overflow: "auto" }}>
			<Flex w="90%" m="0 auto" align="flex-end" wrap="nowrap" gap="1.5em">
				<DateInput
					sx={{ flexShrink: 0 }}
					w="10em"
					size="xs"
					placeholder="日 付"
					label="日 付"
					styles={{ root: { lineHeight: 1.2 }, label: { fontSize: "0.4em", marginLeft: "0.5em" } }}
					value={nDate}
					onChange={handleDate}
					locale="ja"
					valueFormat="YYYY年MM月DD日"
				/>

				{/* <Flex align="center" sx={{ flexShrink: 0 }}>
					<Checkbox
						label={<Text>ピン留め</Text>}
						checked={pin}
						onChange={() => {
							setPin(!pin);
						}}
					/>

					<Tooltip label="webページのトップに固定されます">
						<Flex ml="0.2em">
							<HelpOutlineIcon sx={{ color: c.mainBlack }} />
						</Flex>
					</Tooltip>
				</Flex> */}

				<Flex align="center" sx={{ flexShrink: 0 }}>
					<Checkbox
						label="公 開"
						checked={canPublic}
						onChange={() => {
							setCanPublic(!canPublic);
						}}
						styles={{ label: { paddingLeft: "0.5em" } }}
					/>

					<Tooltip label="この記事を公開します">
						<Flex ml="0.2em">
							<HelpOutlineIcon sx={{ color: cArr.gray[9] }} />
						</Flex>
					</Tooltip>
				</Flex>

				<Flex align="center" sx={{ flexShrink: 0 }}>
					<Checkbox
						label="下書き"
						checked={isDraft}
						onChange={() => {
							setIsDraft(!isDraft);
						}}
						styles={{ label: { paddingLeft: "0.5em" } }}
					/>

					<Tooltip label="下書き">
						<Flex ml="0.2em">
							<HelpOutlineIcon sx={{ color: cArr.gray[9] }} />
						</Flex>
					</Tooltip>
				</Flex>

				<Box sx={{ flexShrink: 0 }}>
					<Select
						w="10em"
						size="xs"
						label="カテゴリー"
						placeholder="カテゴリー"
						itemComponent={SelectItem}
						value={categoryState || categoryList[0]?.name}
						onChange={setCategoryState}
						icon={
							<CircleIcon
								sx={{
									color: categoryList.find((d) => d.id === categoryState)?.color,
									fontSize: "1em",
								}}
							/>
						}
						data={categoryList.map((c) => ({ value: c.id, label: c.name, color: c.color }))}
						styles={{ root: { lineHeight: 1.2 }, label: { fontSize: "0.4em", marginLeft: "0.5em" } }}
					/>
				</Box>
				<Button
					size="xs"
					variant="outline"
					onClick={() => {
						setOpenMetaEditor(true);
					}}
				>
					METAタグ編集
				</Button>
			</Flex>
			<Modal size="xl" opened={openMetaEditor} onClose={() => setOpenMetaEditor(false)} title="METAタグ編集">
				<Stack spacing="xl">
					<Textarea
						placeholder="記事のタイトル"
						label="記事のタイトル (meta title）30字程度"
						value={tmpMetaTitle}
						onChange={(e) => {
							setTmpMetaTitle(e.currentTarget.value);
						}}
					/>
					<Textarea
						placeholder="記事の説明"
						label="記事の説明 (meta description）70字程度"
						autosize
						minRows={4}
						value={tmpMetaDescription}
						onChange={(e) => {
							setTmpMetaDescription(e.currentTarget.value);
						}}
					/>
					<Button
						w="15em"
						size="xs"
						variant="filled"
						onClick={() => {
							setMetaData();
						}}
					>
						METAタグの保存
					</Button>
				</Stack>
			</Modal>
		</Flex>
	);
};
