import { Dispatch, MutableRefObject, SetStateAction, forwardRef, useState } from "react";
import { Box, Flex, Text, CSSObject } from "@mantine/core";

import { c, cArr } from "../../styles/eStyle";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const mainContainer: CSSObject = {
	label: "mainContainer",
	backgroundColor: cArr.gray[2],
	width: "100vw",
	minWidth: "700px",
	height: "100%",
	paddingBottom: "2em",
	marginBottom: "2em",
};

const previewMainContainer: CSSObject = {
	label: "previewMainContainer",
	flexDirection: "column",
	marginLeft: "5vw",
	marginTop: "4em",
	width: "800px",
	// height: "300px",
};

const previewContainer: CSSObject = {
	label: "previewContainer",
	width: "100%",
	backgroundColor: cArr.gray[0],
	backgroundImage: `linear-gradient(0deg, ${cArr.gray[1]} 50%, transparent 50%)`,
	backgroundSize: "5px 5px",
	padding: "2em",
	borderRadius: "0.5em",
};

const previewContainerInLapTop: CSSObject = {
	label: "previewContainerInLapTop",
	...previewContainer,
	aspectRatio: "1/0.65",
};

const previewWrapper = {
	label: "previewWrapper",
	width: "100%",
	// aspectRatio: "1/0.65",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "#FFF",
	padding: "1em",
};

const editContainer: CSSObject = {
	label: "editContainer",
	flexDirection: "column",
	marginTop: "2em",
	marginBottom: "3em",
	gap: "1em",
};

const editWrapper: CSSObject = {
	lebel: "editWrapper",
	backgroundColor: "#FFF",
	padding: "2em",
	borderRadius: "0.5em",
};

const editWrapperStripeBG: CSSObject = {
	...editWrapper,
	lebel: "editWrapperStripeBG",
	backgroundColor: cArr.gray[0],
	backgroundImage: "linear-gradient(0deg, #fff 50%, transparent 50%)",
	backgroundSize: "5px 5px",
	boxShadow: "inset 2px 2px 2px  rgba(0, 0, 0, .3)",
};

const lapTopUpper: CSSObject = {
	label: "lapTopUpper",
	width: "90%",
	aspectRatio: "1/0.665",
	backgroundColor: cArr.gray[7],
	borderRadius: "0.8em",
	padding: "1em",
};

const lapTopBottom: CSSObject = {
	label: "lapTopBottom",
	marginTop: "0.5em",
	width: "100%",
	aspectRatio: "1/0.03415",
	backgroundColor: cArr.gray[7],
	borderRadius: "0 0 0.5em 0.5em",
};

const lapTopBottomInner: CSSObject = {
	label: "lapTopBottomInner",
	width: "10em",
	aspectRatio: "1/0.06",
	backgroundColor: cArr.gray[9],
	borderRadius: "0.5em ",
};

export const FormMainContainer = ({ children }: { children: React.ReactNode }) => {
	return <Box sx={mainContainer}>{children}</Box>;
};

// export const FormEditContainer = ({ width = "90%", children }: { width: string; children: React.ReactNode }) => {
// 	return (
// 		<Flex sx={editContainer} w={width}>
// 			{children}
// 		</Flex>
// 	);
// };

type FormEditPreviewType = {
	type?: "none" | "laptop";
	children: React.ReactNode;
};

const FormEditPreviewInner = ({ type, children }: FormEditPreviewType) => {
	if (type === "laptop") {
		return (
			<Flex mt="1em">
				<Flex w="100%" direction="column" align="center">
					<Flex sx={lapTopUpper}>
						<Flex sx={previewContainerInLapTop}>
							<Flex sx={previewWrapper}>{children}</Flex>
						</Flex>
					</Flex>
					<Flex align="center" justify="center" sx={lapTopBottom}>
						<Box sx={lapTopBottomInner} />
					</Flex>
				</Flex>
			</Flex>
		);
	} else {
		return (
			<Flex mt="1em">
				<Flex sx={previewContainer}>
					<Flex sx={previewWrapper}>{children}</Flex>
				</Flex>
			</Flex>
		);
	}
};

export const FormEditPreview = ({ type = "none", children }: FormEditPreviewType) => {
	return (
		<Flex sx={previewMainContainer}>
			<Flex align="center">
				<VisibilityIcon />
				<Text fz="xs" ml="0.5em">
					プレビュー
				</Text>
			</Flex>

			<FormEditPreviewInner type={type}>{children}</FormEditPreviewInner>
		</Flex>
	);
};

type FormEditContainer = {
	ml: string;
	width: string;
	stripeBG?: boolean;
	title?: string;
	children: React.ReactNode;
};
export const FormEditContainer = ({
	ml = "5vw",
	width = "90%",
	stripeBG = false,
	title = "編 集",
	children,
}: FormEditContainer) => {
	return (
		<Flex direction="column" sx={{ ...editContainer, marginLeft: ml }} w={width}>
			<Flex align="center">
				<EditIcon />
				<Text fz="xs" ml="0.5em">
					{title}
				</Text>
			</Flex>

			<Flex sx={stripeBG ? editWrapperStripeBG : editWrapper}>{children}</Flex>
		</Flex>
	);
};
