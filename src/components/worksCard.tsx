/** @jsxImportSource @emotion/react */

import { useState, useEffect, useRef } from "react";

import NextImage from "next/future/image";

import { css } from "@emotion/react";
import { MediaLib } from "../types/types";
import { Box, Flex, Grid, UnstyledButton, createStyles, keyframes } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import PhotoGalleryComp from "./photoGalleryComp";
import { WorksDataType } from "../data/worksData";

export const WorksCard = ({ items, ...props }: { items: WorksDataType[]; [key: string]: any }) => {
	//
	const [photoArr, setPhotoArr] = useState<WorksDataType[]>(items);

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
	);
};
