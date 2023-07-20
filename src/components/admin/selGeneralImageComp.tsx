import Image from "next/future/image";
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from "react";

import { ImageSelector } from "./imageSelector";

import { MediaLib, MediaLibInitObj } from "../../types/types";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ImageSVG } from "../../svg/imageSVG";
import { c } from "../../styles/eStyle";
import { Box, Flex, Button, Tooltip, UnstyledButton, CSSObject } from "@mantine/core";
import { useDialogState } from "../../hooks/useDialogState";
import { ImageCopySVG } from "../../svg/imageCopySVG";
import { useElementSize } from "@mantine/hooks";

type SelGeneralImageCompType = {
	image: MediaLib;
	setImage: Dispatch<SetStateAction<MediaLib>>;
	mediaLib: MediaLib[];
	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>;
	width: string;
	height?: string;
	type?: string;
	trimCircle?: boolean;
};
export const SelGeneralImageComp = ({
	type = "pict",
	image,
	setImage,
	mediaLib,
	setMediaLib,
	width,
	height,
	trimCircle = false,
}: SelGeneralImageCompType) => {
	//
	const [openImgDialog, setOpenImgDialog] = useState<boolean>(false);
	const [aspectRetio, setAspectRetio] = useState<number>(1);
	const { displayAlert, displayConfirm } = useDialogState();

	const { ref: containerRef, width: textW, height: textH } = useElementSize();

	useEffect(() => {
		if (image) {
			setAspectRetio(image.widthLow / image.heightLow);
		}
	}, [image]);

	const handleDeleteDialog = async () => {
		const isConfirm = await displayConfirm("", "この画像を変更しますか？", "");

		if (!isConfirm) {
			return;
		}

		setImage(MediaLibInitObj);
	};

	const mainContainer: CSSObject = {
		label: "mainContainer",
		width: width,
		fontSize: "1em",
		overflow: "hidden",
		aspectRatio: trimCircle ? "1" : "initial",
		borderRadius: trimCircle ? "50%" : "initial",
	};

	const insertImageStyle: CSSObject = {
		label: "insertImageStyle",
		width: width,
		height: height,
		borderRadius: trimCircle ? "50%" : "0",
		overflow: "hidden",
		backgroundColor: "#e2f0fc",
	};

	const topImage: CSSObject = {
		label: "topImage",
		position: "relative",
		width: width,
		aspectRatio: trimCircle ? "1" : `${aspectRetio}`,
		overflow: "hidden",
		"&:hover": {
			opacity: "0.8",
		},
	};

	const imgCoverStyle: CSSObject = {
		width: "100%",
		height: "100%",
		objectFit: "cover",
	};

	return (
		<Box sx={mainContainer}>
			{!image?.id ? (
				<Flex align="center" justify="center" sx={insertImageStyle} ref={containerRef}>
					<UnstyledButton
						onClick={() => {
							setOpenImgDialog(true);
						}}
						sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1em" }}
					>
						<Flex direction="column" align="center" justify="center" w="60%" miw="4em">
							{type === "user" ? (
								<AccountCircleIcon sx={{ fontSize: "5em", color: c.defaultBlue }} />
							) : (
								<ImageSVG color={c.defaultBlue} width="50%" />
							)}
							<Flex
								align="center"
								mt="0.3em"
								sx={{
									display: textW > 90 ? "flex" : "none",
								}}
							>
								<ImageCopySVG color={c.mainBlack} subText={false} />
							</Flex>
						</Flex>
					</UnstyledButton>
				</Flex>
			) : (
				<Tooltip label={image?.id} openDelay={500}>
					<UnstyledButton sx={topImage} onClick={handleDeleteDialog}>
						{image?.srcHigh && (
							<Box
								component={Image}
								sx={imgCoverStyle}
								src={image.srcHigh}
								width={Number(image.widthHigh)}
								height={Number(image.heightHigh)}
								alt="image"
							/>
						)}
					</UnstyledButton>
				</Tooltip>
			)}

			{openImgDialog && (
				<ImageSelector
					mediaLib={mediaLib}
					setMediaLib={setMediaLib}
					setImage={setImage}
					openImgDialog={openImgDialog}
					setOpenImgDialog={setOpenImgDialog}
				/>
			)}
		</Box>
	);
};
