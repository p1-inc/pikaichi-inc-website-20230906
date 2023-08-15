import { Dispatch, SetStateAction, useState } from "react";

import { ImageTableComp } from "./imageTableComp";
import { Box, Button, Collapse, Flex, Modal, Space, Text } from "@mantine/core";
import { MediaLib } from "../../types/types";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { ImageDropzone } from "../commonComponents/imageDropzone";

type ImageSelector = {
	mediaLib: MediaLib[];
	setMediaLib: Dispatch<SetStateAction<MediaLib[]>>;
	setImage: Dispatch<SetStateAction<MediaLib>>;
	openImgDialog: boolean;
	setOpenImgDialog: Dispatch<SetStateAction<boolean>>;
};
export const ImageSelector = ({ mediaLib, setMediaLib, setImage, openImgDialog, setOpenImgDialog }: ImageSelector) => {
	//
	const [checkedMediaLib, setCheckedMediaLib] = useState<string>();
	const [dropZoneOpened, setDropZoneOpened] = useState<boolean>(false);

	const handleEdit = async (id: string) => {
		const mData = mediaLib.find((data) => data.id === id);
		setImage(mData);
		setOpenImgDialog(false);
	};

	const handleClose = () => {
		setOpenImgDialog(false);
	};

	const handleNormalClicked = (id: string) => {
		if (checkedMediaLib === id) {
			setCheckedMediaLib("");
		} else {
			setCheckedMediaLib(id);
		}
	};

	const { handleClicked } = useDoubleClick({ handleNormalClicked, handleDoubleClicked: handleEdit });

	return (
		<>
			<Modal.Root
				opened={openImgDialog}
				onClose={() => {
					setOpenImgDialog(false);
				}}
				size="95%"
			>
				<Modal.Overlay />
				<Modal.Content>
					<Modal.Header>
						<Modal.Title>
							<Flex w="100%" direction="column">
								画像の変更
							</Flex>
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<Box m="0 auto">
							<Flex
								w="100%"
								h="4em"
								align="center"
								gap="1em"
								sx={{
									zIndex: 1000,
								}}
								justify="space-between"
							>
								<Flex>
									<Button
										w="20em"
										onClick={() => {
											setDropZoneOpened(!dropZoneOpened);
										}}
									>
										新規メディア
									</Button>
								</Flex>
								<Flex gap="1em">
									<Button variant="outline" w="10em" onClick={handleClose}>
										CANCEL
									</Button>
									<Button
										w="10em"
										onClick={() => {
											handleEdit(checkedMediaLib);
										}}
									>
										O K
									</Button>
								</Flex>
							</Flex>
							<ImageDropzone mediaLib={mediaLib} setMediaLib={setMediaLib} dropZoneOpened={dropZoneOpened} w="100%" mb="1em" />

							<ImageTableComp
								uniqueKey={"media"}
								media={mediaLib}
								checkedMediaLib={checkedMediaLib}
								// setCheckedMediaLib={setCheckedMediaLib}
								width={"10%"}
								marginTop={"2em"}
								// handleClickMedia={handleClickMedia}
								handleClicked={handleClicked}
							/>
							<Space h="4em" />
						</Box>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};
