import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";

import Image from "next/future/image";

import { MediaLib } from "../../types/types";
import { Box, CSSObject, Flex, Tooltip, UnstyledButton, Text } from "@mantine/core";

import { c, cArr } from "../../styles/eStyle";
import { UpdatedAtUI } from "../UILib/UIset";

type ImageTableCompType = {
	uniqueKey: string;
	media: MediaLib[];
	width: string;
	marginTop: string;
	checkedMediaLib: string;
	// setCheckedMediaLib: Dispatch<SetStateAction<string>>;
	// handleClickMedia: any;
	handleClicked: (props: string) => void;
};

export const ImageTableComp = ({
	uniqueKey,
	media,
	width,
	marginTop = "0",
	checkedMediaLib,
	// setCheckedMediaLib,
	// handleClickMedia,
	handleClicked,
}: ImageTableCompType) => {
	//////////////////////////////////////////
	//////////////////////////////////////////

	const imageWrapper: CSSObject = {
		label: "imageWrapper",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "0.7em",
		width: "10em",
		height: "14em",
		// textAlign: "center",
		borderRadius: "0.7em",
		overflow: "hidden",
		boxShadow: " 2px 2px 2px  rgba(0, 0, 0, .3)",
		"&:hover": {
			cursor: "pointer",
			opacity: "0.5",
			transition: "0.1s",
		},
	};

	const noimage: CSSObject = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "20vw",
		textAlign: "center",
		backgroundColor: cArr.gray[2],
		borderRadius: "0.5em",
	};

	//////////////////////////////////////////
	//////////////////////////////////////////

	const NoImage = () => {
		return (
			<Box
				sx={{
					width: "100%",
					aspectRatio: "1/1",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						width: "100%",
						aspectRatio: "3/2",
						backgroundColor: "#BBB",
						fontSize: "0.5em",
						padding: "1em",
					}}
				>
					<span>画像読込中...</span>
					<span>しばらくしてから、</span>
					<span> リロードしてください。</span>
				</Box>
			</Box>
		);
	};

	if (media && media.length !== 0) {
		return (
			<Flex justify="center" w="fit-content">
				<Flex wrap="wrap" gap="0.5em">
					{[...media]
						.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
						.map((item, index) => {
							const bgColor = { backgroundColor: checkedMediaLib === item.id ? cArr.blue[1] : "#f0f3f5" };
							let imgSrc = item.srcHigh;
							if (item.contentTypeHigh === "image/vnd.microsoft.icon") {
								imgSrc = item.src;
							}

							return (
								<Box
									key={item.id || "id"}
									sx={{
										borderRadius: "0.7em",
										...bgColor,
									}}
								>
									<Tooltip label={item.id} color="gray" withArrow>
										<UnstyledButton
											sx={imageWrapper}
											onClick={() => {
												handleClicked(item.id);
											}}
											// onClick={(e) => {
											// 	if (checkedMediaLib === item.id) {
											// 		setCheckedMediaLib("");
											// 	} else {
											// 		setCheckedMediaLib(item.id);
											// 	}
											// }}
										>
											{item.src ? (
												<Box
													component={Image}
													sx={{
														width: "9em",
														height: "9em",
														objectFit: "contain",
														...bgColor,
													}}
													src={imgSrc}
													alt="gallery of image"
													width="1000"
													height="1000"
												/>
											) : (
												<NoImage />
											)}

											<Text truncate fz="0.8em" mt="0.8em" w="100%">
												{item.id}
											</Text>
											<Box mt="auto" mb="0" w="100%">
												<UpdatedAtUI fullDate updatedAt={item.updatedAt} />
											</Box>
										</UnstyledButton>
									</Tooltip>
								</Box>
							);
						})}
				</Flex>
			</Flex>
		);
	} else {
		return (
			<Box mt={marginTop} sx={noimage}>
				<p>イメージがありません</p>
			</Box>
		);
	}
};
