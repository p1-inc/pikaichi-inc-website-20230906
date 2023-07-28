import { Dispatch, SetStateAction, useState } from "react";

import { ImageTableComp } from "./imageTableComp";
import { Box, Button, Flex, Modal, Space } from "@mantine/core";
import { MediaLib } from "../../types/types";
import { useDoubleClick } from "../../hooks/useDoubleClick";

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
							<Flex direction="column">
								画像の変更
								<Flex
									h="4em"
									align="center"
									gap="1em"
									sx={{
										zIndex: 1000,
									}}
								>
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
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<Box m="0 auto">
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
