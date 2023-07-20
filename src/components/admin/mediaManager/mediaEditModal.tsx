//
import Image from "next/future/image";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { useForm, yupResolver } from "@mantine/form";

import { MediaLib, MediaLibInitObj } from "../../../types/types";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { c, cArr } from "../../../styles/eStyle";

import { Box, Button, Collapse, Flex, Modal, Text } from "@mantine/core";
import { getDateFormat } from "../../../util/getDateFormat";
import { FormTextAreaComponent, FormTextFieldComponent } from "../../commonComponents/formComponent";
import { getUsageInfo } from "../../../util/getUsageInfo";

type MediaEditModal = {
	checkedMediaLib: string;
	setCheckedMediaLib: Dispatch<SetStateAction<string>>;
	media: MediaLib;
	mediaUsage: [string, string[][]];
	handleUpdateMedia: any;
	handleDeleteMedia: any;
};

const MediaEditModal = ({
	checkedMediaLib,
	setCheckedMediaLib,
	media,
	mediaUsage,
	handleUpdateMedia,
	handleDeleteMedia,
}: MediaEditModal) => {
	//
	const [usageOpened, setUsageOpened] = useState(false);
	const mediaUsageInfo = getUsageInfo(mediaUsage); //usageInfoメッセージを変換

	const form = useForm<MediaLib>({
		initialValues: {
			id: media?.id,
			src: media?.src,
			srcHigh: media?.srcHigh,
			widthLow: media?.widthLow,
			heightLow: media?.heightLow,
			widthHigh: media?.widthHigh,
			heightHigh: media?.heightHigh,
			createdAt: media?.createdAt,
			updatedAt: media?.updatedAt,
			contentTypeLow: media?.contentTypeLow,
			contentTypeHigh: media?.contentTypeHigh,
			alt: media?.alt,
			caption: media?.caption,
			description: media?.description,
			tag: media?.tag,
		},
	});

	return (
		<Modal
			size="90%"
			padding="2em"
			opened={Boolean(checkedMediaLib)}
			onClose={() => {
				setCheckedMediaLib(undefined);
			}}
			title="メディアの編集"
		>
			<Flex direction="column" align="center">
				<Flex mt="2em" w="100%" maw="25em" sx={{ overflow: "hidden", aspectRatio: "3/2" }}>
					<Image
						alt="image"
						src={media?.srcHigh}
						width={Number(media?.widthHigh)}
						height={Number(media?.heightHigh)}
						style={{
							width: "100%",
							height: "auto",
							objectFit: "contain",
						}}
					/>
				</Flex>
				<Flex direction="column" mt="2em">
					<FormTextFieldComponent
						readOnly
						title="画像ID"
						width="18em"
						titleWidth="7em"
						value={form.values.id || ""}
						tooltip="画像IDは変更できません"
					/>
					<FormTextFieldComponent
						title="代替テキスト"
						width="18em"
						titleWidth="7em"
						formProps={form.getInputProps("alt")}
					/>

					<FormTextFieldComponent
						title="キャプション"
						width="18em"
						titleWidth="7em"
						formProps={form.getInputProps("caption")}
					/>
					<FormTextAreaComponent
						title="説  明"
						width="32em"
						titleWidth="7em"
						rows={5}
						formProps={form.getInputProps("description")}
					/>
					<FormTextFieldComponent
						readOnly
						title="更新日"
						width="18em"
						titleWidth="7em"
						value={getDateFormat(form.values.updatedAt) || ""}
						tooltip="更新日は変更できません"
					/>

					<>
						<Button
							mt="2em"
							ml="-2em"
							size="xs"
							w="10em"
							radius="xl"
							variant="outline"
							onClick={() => {
								setUsageOpened(!usageOpened);
							}}
						>
							<Flex align="center">
								<Text fz="1em" mr="1em">
									使用状況
								</Text>
								<Box sx={{ transform: usageOpened ? "rotate(90deg)" : "none", transition: "0.2s transform" }}>
									<ArrowForwardIosIcon sx={{ fontSize: "1em" }} />
								</Box>
							</Flex>
						</Button>
						<Collapse in={usageOpened}>
							{mediaUsageInfo ? (
								<Flex
									direction="column"
									mt="1em"
									sx={{ border: `solid 2px ${cArr.gray[5]}`, borderRadius: "0.5em", overflow: "hidden" }}
								>
									{mediaUsageInfo[1].map((d, index) => (
										<Text
											key={`key${index}`}
											fz="0.8em"
											p="0.4em"
											sx={{ backgroundColor: index % 2 === 0 ? cArr.gray[1] : "#FFF" }}
										>{`・${d[1]} | ${d[0]}`}</Text>
									))}
								</Flex>
							) : (
								<Flex direction="column" mt="1em" align="center" p="1em" sx={{ backgroundColor: cArr.gray[2] }}>
									<Text fz="0.8em" p="0.4em">
										なし
									</Text>
								</Flex>
							)}
						</Collapse>
					</>

					<Flex mt="2em" justify="flex-end" gap="1em">
						<Button
							size="xs"
							w="13em"
							variant="outline"
							onClick={() => {
								setCheckedMediaLib(undefined);
							}}
						>
							閉じる
						</Button>
						<Button
							size="xs"
							w="13em"
							onClick={() => {
								handleUpdateMedia(form);
							}}
						>
							保 存
						</Button>
						<Button
							size="xs"
							w="13em"
							color="red"
							onClick={() => {
								handleDeleteMedia(media.id, mediaUsageInfo);
							}}
						>
							このメディアを削除
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Modal>
	);
};

export default MediaEditModal;
