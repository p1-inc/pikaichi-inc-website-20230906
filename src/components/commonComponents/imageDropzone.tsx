import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { getMediaLib, setMediaToStorage, setTempMedia } from "../../firebase/firebase";
import { useDialogState } from "../../hooks/useDialogState";

import { resizeImage } from "../../util/resizeImage";
import { sortByUpdated } from "../../util/sortByUpdated";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { MediaLib } from "../../types/types";
import { Box, Collapse, Flex, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

import { c, cArr } from "../../styles/eStyle";

const handleImportImage = async (
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
	console.log("tmpImgDataArr : ", tmpImgDataArr);

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

type ImageDropzoneType = {
	mediaLib: MediaLib[];
	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>;
	dropZoneOpened: boolean;
	// setDropZoneOpened: Dispatch<SetStateAction<boolean>>;
	[key: string]: any;
};
export const ImageDropzone = ({ mediaLib, setMediaLib, dropZoneOpened, ...props }: ImageDropzoneType) => {
	//
	const { displayAlert, displayConfirm } = useDialogState();
	const [checkedMediaLib, setCheckedMediaLib] = useState<string>();
	const [progress, setProgress] = useState<number>(0);
	const MIME_TYPE = ["image/png", "image/gif", "image/jpeg", "image/svg+xml", "image/webp"];

	useEffect(() => {
		const f = async () => {
			const _mediaLib = await getMediaLib();
			const mediaLib = sortByUpdated(_mediaLib);
			setMediaLib(mediaLib);
		};

		f();
	}, []);

	return (
		<Collapse in={dropZoneOpened} mt="1em">
			<Dropzone
				{...props}
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
	);
};
