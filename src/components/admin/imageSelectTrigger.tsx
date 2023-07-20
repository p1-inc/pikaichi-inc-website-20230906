import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/future/image";

import { ImageSelector } from "./imageSelector";

import { MediaLib } from "../../types/types";

import { c, cArr } from "../../styles/eStyle";

import { Modal, Button, Flex, UnstyledButton, Tooltip, Box, CSSObject } from "@mantine/core";
import { getMediaLib } from "../../firebase/firebase";
import { ImageSVG } from "../../svg/imageSVG";
import { useElementSize } from "@mantine/hooks";
import { SizeType } from "./tableSelectTrigger";

type DialogCompType = {
	dialogOpen: boolean;
	setDialogOpen: Dispatch<SetStateAction<boolean>>;
	handleDialogClose: () => void;
	setImage: Dispatch<SetStateAction<MediaLib>>;
	sizeState: SizeType;
	setSizeState: Dispatch<SetStateAction<SizeType>>;
	setOpenImgDialog: Dispatch<SetStateAction<boolean>>;
};

const DialogComp = ({
	dialogOpen,
	setDialogOpen,
	handleDialogClose,
	setImage,
	sizeState,
	setSizeState,
	setOpenImgDialog,
}: DialogCompType) => {
	//
	const handleSizeChange = (size: SizeType) => {
		setSizeState(size);
		handleDialogClose();
	};

	const sizeItem: SizeType[] = ["xs", "s", "m", "l", "xl"];

	return (
		<Modal
			centered
			opened={dialogOpen}
			onClose={handleDialogClose}
			title="画像の変更"
			size="lg"
			styles={{ header: { paddingBottom: "0.5em" } }}
		>
			<Flex w="25em" m="0 auto" direction="column">
				<Button.Group orientation="vertical">
					{sizeItem.map((size) => (
						<Button
							key={size}
							uppercase
							w="100%"
							variant="outline"
							sx={{ backgroundColor: size === sizeState ? c.l_yellow : "" }}
							onClick={() => {
								handleSizeChange(size);
							}}
						>
							サイズ {size}
							{size === sizeState ? "*" : ""}
						</Button>
					))}
				</Button.Group>
				<Flex w="25em" m="0 auto" mt="1em" direction="column" gap="0.3em">
					<Button
						w="100%"
						variant="outline"
						onClick={() => {
							setOpenImgDialog(true);
							setDialogOpen(false);
						}}
					>
						画像の変更
					</Button>
					<Button
						w="100%"
						variant="outline"
						onClick={() => {
							setImage(null);
							setDialogOpen(false);
						}}
					>
						画像の削除
					</Button>
					<Button w="100%" variant="subtle" onClick={handleDialogClose}>
						CANCEL
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};

type ImageGalleryComp = {
	imgData: MediaLib;
	size: SizeType;
	onImgUrlChange: (newData: MediaLib) => void;
	onSizeChange?: (size: string) => void;
	readOnly?: boolean;
};

export const ImageSelectTrigger = ({
	imgData,
	size = "m",
	onImgUrlChange,
	onSizeChange = () => {},
	readOnly = false,
}: ImageGalleryComp) => {
	//
	const [mediaLib, setMediaLib] = useState<MediaLib[]>();

	const [image, setImage] = useState<MediaLib>(imgData);
	const [sizeState, setSizeState] = useState<SizeType>(size);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [openImgDialog, setOpenImgDialog] = useState<boolean>(false);

	const { ref, width: wrapW } = useElementSize();
	const [aspectRatio, setAspectRatio] = useState<number[]>([imgData?.widthHigh, imgData?.heightHigh]);

	useEffect(() => {
		const editMode = async () => {
			const mediaLib = await getMediaLib();

			setMediaLib(mediaLib);
			// 			const media = mediaLib.find((e) => e.id === imgData?.id);
			//
			// 			if (media) {
			// 				setImage(media);
			// 				setAspectRatio([media.widthHigh, media.heightHigh]);
			// 			}
		};
		if (!readOnly) {
			editMode();
		}
	}, [imgData]);

	useEffect(() => {
		if (image) {
			onImgUrlChange(image);
		} else {
			onImgUrlChange(null);
		}
		if (onSizeChange) {
			onSizeChange(sizeState);
		}
	}, [image, sizeState]);

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const sizeList: { id: string; label: string; retio: number }[] = [
		{ id: "xs", label: "サイズ[XS]", retio: 0.6 },
		{ id: "s", label: "サイズ[S]", retio: 0.7 },
		{ id: "m", label: "サイズ[M]", retio: 0.8 },
		{ id: "l", label: "サイズ[L]", retio: 0.9 },
		{ id: "xl", label: "サイズ[XL]", retio: 1 },
	];

	const getSize = (size: string) => {
		let result = 1;
		const res = sizeList.find((d) => d.id === size);
		if (res) {
			result = res.retio;
		}
		return result;
	};

	const getImageWrapperSize = ({
		size,
		wrapW,
		aspectRatio,
	}: { size: string; wrapW: number; aspectRatio: number[] }) => {
		const _scaledWidth = aspectRatio[1] > aspectRatio[0] ? (aspectRatio[0] / aspectRatio[1]) * wrapW : wrapW;
		const scaledWidth = _scaledWidth * getSize(size);
		return scaledWidth;
	};

	if (!readOnly) {
		return (
			<Box ref={ref} w="100%" fz="1em">
				{!image && (
					<UnstyledButton
						onClick={() => {
							setOpenImgDialog(true);
						}}
					>
						<Flex
							justify="center"
							align="center"
							w="16em"
							h="9em"
							sx={{ aspectRatio: "3/2", backgroundColor: cArr.skyblue[2] }}
						>
							<ImageSVG color="#FFF" width="5em" height="5em" />
						</Flex>
					</UnstyledButton>
				)}

				{image && (
					<Box
						w={getImageWrapperSize({ size, wrapW, aspectRatio })}
						sx={{
							label: "topImage",
							position: "relative",
							"&:hover": {
								opacity: readOnly ? 1 : 0.8,
							},
							aspectRatio: `${aspectRatio[0]} / ${aspectRatio[1]}`,
						}}
					>
						<Tooltip label={image?.id}>
							<UnstyledButton
								onClick={() => {
									setDialogOpen(true);
								}}
							>
								<Box
									component={Image}
									w="100%"
									h="100%"
									sx={{ objectFit: "contain" }}
									src={image.srcHigh}
									alt="image"
									width={image.widthHigh}
									height={image.heightHigh}
								/>
							</UnstyledButton>
						</Tooltip>
					</Box>
				)}

				<ImageSelector
					mediaLib={mediaLib}
					setMediaLib={setMediaLib}
					setImage={setImage}
					openImgDialog={openImgDialog}
					setOpenImgDialog={setOpenImgDialog}
				/>

				<DialogComp
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
					handleDialogClose={handleDialogClose}
					setImage={setImage}
					sizeState={sizeState}
					setSizeState={setSizeState}
					setOpenImgDialog={setOpenImgDialog}
				/>
			</Box>
		);
	} else {
		return (
			<Box ref={ref} w="100%" fz="1em">
				{image && (
					<Box
						w={getImageWrapperSize({ size, wrapW, aspectRatio })}
						sx={{
							label: "topImage",
							position: "relative",
							aspectRatio: `${aspectRatio[0]} / ${aspectRatio[1]}`,
						}}
					>
						<Box
							component={Image}
							w="100%"
							h="100%"
							sx={{ objectFit: "contain" }}
							src={image.srcHigh}
							alt="image"
							width={image.widthHigh}
							height={image.heightHigh}
						/>
					</Box>
				)}
				{!image && <div>No Image</div>}
			</Box>
		);
	}
};
