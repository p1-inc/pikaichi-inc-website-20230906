/** @jsxImportSource @emotion/react */

import { useState, useEffect, useRef } from "react";

import NextImage from "next/future/image";

import { css } from "@emotion/react";
import { MediaLib } from "../types/types";
import { Box, Flex, Grid, UnstyledButton, createStyles, keyframes } from "@mantine/core";
import { WordImageDataType } from "../pages";
import { useResizeObserver } from "@mantine/hooks";
import PhotoGalleryComp from "./photoGalleryComp";

export const WorksCard = ({ items, ...props }: { items: WordImageDataType[]; [key: string]: any }) => {
	//
	const [photoArr, setPhotoArr] = useState<WordImageDataType[]>(items);

	const [parentRef, parentRect] = useResizeObserver();

	useEffect(() => {
		setPhotoArr(items);
	}, [items]);

	const container = {
		label: "container",
		maxWidth: "1024px",
		margin: "0 auto",
		fontSize: "1em",
		width: "100%",
	};

	const bp = [
		[1100, 5],
		[800, 4],
		[500, 3],
		[200, 2],
	];

	const remainderBoxcolor = ["#FFF"];

	return (
		<Box sx={container} ref={parentRef} {...props}>
			<PhotoGalleryComp windowWidth={parentRect.width} photoGalleryData={photoArr} bp={bp} remainderBoxcolor={remainderBoxcolor} br="0.5em" />
		</Box>

		// 		<Grid justify="center" grow={false}>
		// 			{items.map((item) => {
		// 				return (
		// 					<Grid.Col span={3} w="20em" h="20em" sx={{ aspectRatio: "1 /1" }}>
		// 						<Box
		// 							key={item.fileName}
		// 							component={NextImage}
		// 							src={item.src}
		// 							alt="Picture of the author"
		// 							w="20em"
		// 							// h="20em"
		//
		// 							width={item.width}
		// 							height={item.height}
		// 							sx={{ objectFit: "cover" }}
		// 						/>
		// 					</Grid.Col>
		// 				);
		// 			})}
		// 		</Grid>

		// <Flex w="90%" wrap="wrap" m="0 auto" gap="1em">
		// 	{items.map((item) => {
		// 		return (
		// 			<Box
		// 				key={item.fileName}
		// 				component={NextImage}
		// 				src={item.src}
		// 				alt="Picture of the author"
		// 				w="20em"
		// 				h="20em"
		// 				width={item.width}
		// 				height={item.height}
		// 				sx={{ objectFit: "cover" }}
		// 			/>
		// 		);
		// 	})}
		// </Flex>
	);
};
