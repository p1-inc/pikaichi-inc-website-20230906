import { useState, useEffect, useRef, Dispatch, SetStateAction, ChangeEvent, ChangeEventHandler } from "react";
import Head from "next/head";

import dayjs from "dayjs";

import { MediaLib } from "../../../types/types";

import { getMediaLib, deleteMediaLib, setMediaToStorage, setTempMedia, getMediaUsage, updateMediaToDB } from "../../../firebase/firebase";
//
import { ImageTableComp } from "../imageTableComp";
import { AdminHeader } from "../adminHeader";

import { useDialogState } from "../../../hooks/useDialogState";

import { c, cArr } from "../../../styles/eStyle";

import { sortByUpdated } from "../../../util/sortByUpdated";
import { resizeImage } from "../../../util/resizeImage";
import { Box, Button, Checkbox, Collapse, Flex, Select, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { itemsfilteredByUpdated, refineByUpdatedList } from "../../../util/itemfilteredByUpdated";
import { FormMainContainer } from "../../commonComponents/formContainer";
import { AdminSubHeader } from "../adminSubHeader";
import MediaEditModal from "./mediaEditModal";
import { UseFormReturnType } from "@mantine/form";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useDoubleClick } from "../../../hooks/useDoubleClick";

export const handleImportImage = async (
	files: FileWithPath[],
	mediaLib: MediaLib[],
	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>,
	setProgress: Dispatch<SetStateAction<number>>,
	displayAlert: (title?: string, msg?: string, color?: string) => Promise<boolean>,
	displayConfirm: (title?: string, msg?: string, color?: string) => Promise<boolean>,
	setCheckedMediaLib: Dispatch<SetStateAction<string>>,
) => {
	//
	const reg = new RegExp("(__low__|__high__)");
	const valiDateFile = files.flatMap((file) => {
		const res = [];
		if (file.size > 10 * 1024 * 1024) {
			res.push("ファイルのサイズが大きすぎます。1つにつき最大10MB以内にしてください");
		}
		if (file.name.match(reg)) {
			res.push(`適切ではないファイルが見つかりました（ファイル名に"__low__"、または"__high__"）を使用しないでください`);
		}
		return res;
	});

	if (valiDateFile.length > 0) {
		await displayAlert("", valiDateFile[0], "red");
		return;
	}
	const currentMediaName = mediaLib.map((media) => media.id);
	const newMediaName = files.map((media) => media.name.replace(/\.[^.]*$/, ""));
	const isExist = newMediaName.filter((d) => currentMediaName.includes(d));

	let canOverWrite = false;
	if (isExist.length > 0) {
		const isConfirm = await displayConfirm("", `同じファイル名の画像が存在しています、上書きしますか?\n${isExist.join(" / ")}`, "");
		if (!isConfirm) {
			return;
		} else {
			canOverWrite = true;
		}
	}

	const _mediaLib = mediaLib.filter((d) => !isExist.includes(d.id));
	const dupMedia = mediaLib.filter((d) => isExist.includes(d.id)); //重複メディア

	const mediaArrResize = await resizeImage(files);
	if (!mediaArrResize) {
		await displayAlert("", "アップロードに失敗しました::444", "red");
		return;
	}

	let uploadedMediaData;

	try {
		uploadedMediaData = await setMediaToStorage(mediaArrResize, setProgress);

		if (!uploadedMediaData) {
			await displayAlert("", "アップロードに失敗しました::454", "red");
			return;
		}
	} catch (error) {
		console.log(error);
		await displayAlert("", "アップロードに失敗しました::459", "red");
		return;
	}

	const tmpImgDataArr = await setTempMedia(uploadedMediaData, canOverWrite);

	if (tmpImgDataArr === "error") {
		const nMedia = sortByUpdated(_mediaLib);
		setMediaLib(nMedia);
	} else {
		const nMedia = sortByUpdated([..._mediaLib, ...tmpImgDataArr]);
		setMediaLib(nMedia);
		setProgress(0);
		await displayAlert("", "アップロードしました", "");
	}
	setCheckedMediaLib(undefined);
};

type HandleImportImageType = {
	event: ChangeEvent<HTMLInputElement>;
	mediaLib: MediaLib[];
	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>;
	setProgress: Dispatch<SetStateAction<number>>;
	displayAlert: (title?: string, msg?: string, color?: string) => Promise<unknown>;
	displayConfirm: (title?: string, msg?: string, color?: string) => Promise<unknown>;
};

const MediaManager = () => {
	//
	const componentName = "メディアの管理";

	const router = useRouter();

	const [mediaLib_f, setMediaLib_f] = useState<MediaLib[]>([]);

	const [mediaLib, setMediaLib] = useState<MediaLib[]>();
	const [mediaUsage, setMediaUsage] = useState<[string, string[][]][]>();

	const [dropZoneOpened, setDropZoneOpened] = useState<boolean>(false);

	const [checkedMediaLib, setCheckedMediaLib] = useState<string>();

	const { displayAlert, displayConfirm, displayConfirmSaveAs, displayBigDialog2 } = useDialogState();

	const [progress, setProgress] = useState<number>(0);

	const [refineKey, setRefineKey] = useState<string>("all");

	const MIME_TYPE = ["image/png", "image/gif", "image/jpeg", "image/svg+xml", "image/webp"];

	useEffect(() => {
		const f = async () => {
			const _mediaLib = await getMediaLib();

			const mediaLib = sortByUpdated(_mediaLib);
			setMediaLib(mediaLib);
			setMediaLib_f(mediaLib);

			const usageList = await getMediaUsage();
			setMediaUsage(usageList);
		};

		f();
	}, []);

	useEffect(() => {
		const refinedMedia = itemsfilteredByUpdated(refineKey, mediaLib);
		setMediaLib_f(refinedMedia);
	}, [refineKey, mediaLib]);

	const title = {
		marginTop: "3em",
		color: c.mainBlack,
		fontSize: "1em",
	};

	const leadCopy = {
		color: c.mainBlack,
		marginTop: "0.5rem",
		fontSize: "0.7em",
	};

	const { handleClicked } = useDoubleClick({ handleNormalClicked: setCheckedMediaLib });

	const handleUpdateMedia = async (form: UseFormReturnType<MediaLib, (values: MediaLib) => MediaLib>) => {
		//
		if (!form) {
			await displayAlert("", "保存できませんでした", "red");
		}

		let tmpCreatedAt;
		let tmpUpdatedAt;

		const now = dayjs();

		if (!form.values.createdAt || form.values.createdAt === "") {
			const day = now.format("YYYY-MM-DD-HH-mm-ss");
			tmpCreatedAt = day;
			tmpUpdatedAt = day;
		} else {
			tmpCreatedAt = form.values.createdAt;
			tmpUpdatedAt = now.format("YYYY-MM-DD-HH-mm-ss");
		}

		const v = form.values;

		const data: MediaLib = {
			...v,
			createdAt: tmpCreatedAt,
			updatedAt: tmpUpdatedAt,
		};

		try {
			const result = await updateMediaToDB(data);

			if (result === "success") {
				await displayAlert("", "保存しました", "");
			} else {
				await displayAlert("", "保存に失敗しました", "red");
			}
		} catch (error) {
			await displayAlert("", "失敗しました", "");
			console.log(error);
		}
		router.push("/admin/mediaManager/");
	};

	const handleDeleteMedia = async (mediaId: string, mediaUsageInfo: [string, string[][]]) => {
		const headCells = [
			{
				id: "id",
				label: "メディアID",
				width: "20em",
			},
			{
				id: "usage",
				label: "使用状況",
				width: "50em",
			},
		];

		if (mediaUsageInfo?.length > 0) {
			const isConfirm = await displayBigDialog2(
				"選択された画像が他のコンポーネントで使用しています。コンポーネントを削除してからもう一度画像を削除してください",
				"",
				headCells,
				[mediaUsageInfo],
			);
			return;
		}

		const isConfirm = await displayConfirm("", `ID:${mediaId}\nこのデータを削除しますか？`, "");

		if (!isConfirm) {
			return;
		}

		try {
			const result = await deleteMediaLib([mediaId]);

			if (result === "success") {
				await displayAlert("", "データを削除しました", "");
			} else {
				await displayAlert("", "データの削除に失敗しました", "red");
			}
		} catch (error) {
			console.log(error);
		}

		setMediaLib(mediaLib.filter((d) => d.id !== mediaId));
		router.push("/admin/mediaManager/");
	};

	return (
		<FormMainContainer>
			<Head>
				<title>{componentName}</title>
			</Head>

			<AdminHeader title={componentName} />

			<Box w="80%" m="0 auto">
				<Flex direction="column" w="100%" m="0 auto">
					<Text component="h1" sx={title}>
						メディアの管理
					</Text>
					<Text component="h2" sx={leadCopy}>
						このwebサイトで使用するメディア（画像、動画）を管理します
					</Text>
					<Flex direction="column" mt="2em">
						<Button
							w="20em"
							onClick={() => {
								setDropZoneOpened(!dropZoneOpened);
							}}
						>
							新規メディア
						</Button>
						<Collapse in={dropZoneOpened} mt="1em">
							<Dropzone
								loading={progress === 0 ? false : true}
								onDrop={(files) => handleImportImage(files, mediaLib, setMediaLib, setProgress, displayAlert, displayConfirm, setCheckedMediaLib)}
								onReject={(files) => console.log("rejected files", files)}
								accept={MIME_TYPE}
							>
								<Flex align="center" justify="center" w="100%" h="7em">
									<Dropzone.Accept>
										<IconUpload size="3em" stroke={1.5} color={c.defaultBlue} />
									</Dropzone.Accept>
									<Dropzone.Reject>
										<IconX size="3em" stroke={1.5} color={c.red} />
									</Dropzone.Reject>
									<Dropzone.Idle>
										<IconPhoto size="3em" stroke={1.5} color={c.mainBlack} />
									</Dropzone.Idle>
									<Box ml="0.5em">
										<Text size="0.8em" color={c.mainBlack}>
											ファイルをドロップ、またはクリックしてアップロードしてください。
										</Text>
										<Text size="0.7em" color={cArr.gray[9]} mt="0.1em">
											ファイルサイズは10MB以内にしてください（PNG/GIF/JPEG/SVG/WebP）
										</Text>
									</Box>
								</Flex>
							</Dropzone>
						</Collapse>
					</Flex>

					<Flex
						direction="column"
						mt="1em"
						mih="800px"
						p="1em"
						sx={{ backgroundColor: "#F5F5F5", borderRadius: "1em", boxShadow: "inset 2px 2px 2px  rgba(0, 0, 0, .3)" }}
					>
						<Flex align="center" mb="1em" w="100%">
							<Select
								size="xs"
								placeholder="日付で絞り込み"
								maxDropdownHeight={1000}
								data={refineByUpdatedList}
								onChange={(value) => {
									setRefineKey(value);
								}}
							/>
							<Text fz="0.8em" ml="1em">{`全${mediaLib_f?.length}個`}</Text>
						</Flex>
						<ImageTableComp
							uniqueKey={"media"}
							media={mediaLib_f}
							checkedMediaLib={checkedMediaLib}
							width={"10%"}
							marginTop={"2rem"}
							handleClicked={handleClicked}
						/>
					</Flex>
				</Flex>
			</Box>

			{checkedMediaLib && (
				<MediaEditModal
					checkedMediaLib={checkedMediaLib}
					setCheckedMediaLib={setCheckedMediaLib}
					media={mediaLib?.find((d) => d.id === checkedMediaLib)}
					mediaUsage={mediaUsage?.find((d) => d[0] === checkedMediaLib)}
					handleUpdateMedia={handleUpdateMedia}
					handleDeleteMedia={handleDeleteMedia}
				/>
			)}
		</FormMainContainer>
	);
};

export default MediaManager;
