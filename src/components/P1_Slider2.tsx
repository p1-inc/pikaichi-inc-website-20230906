/** @jsxImportSource @emotion/react */

import { useState, useEffect, useRef } from "react";

import NextImage from "next/future/image";

import { css } from "@emotion/react";
import { MediaLib } from "../types/types";
import { Box, UnstyledButton, createStyles, keyframes } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { WorksDataType } from "../data/worksData";
import { useRespStyles } from "../hooks/useRespStyles";

export const bounce = keyframes({
	"0%": {
		transform: "scale(1)",
	},
	"50%": {
		transform: "scale(1.1)",
	},
	"100%": {
		transform: "scale(1)",
	},
});

export default function P1_Slider2({ images = [] }: { images: WorksDataType[] }) {
	//
	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });

	const autoplay = useRef<any>(Autoplay({ delay: 10000 }));

	const useStyles = createStyles((theme) => ({
		workImgAnimation: {
			transformOrigin: "80% 80%",
			animation: `${bounce} 20s  infinite`,
		},
	}));

	const { classes } = useStyles();

	return (
		<Box ref={containerRef}>
			<Carousel loop mx="auto" withIndicators plugins={[autoplay.current]} w="100%" height={mq.tabs ? "90vw" : "100vh"} mah="50em" sx={{ overflow: "hidden" }}>
				{images.map((image, index) => (
					<Carousel.Slide key={image.id} sx={{ overflow: "hidden" }}>
						<Box
							component={NextImage}
							className={classes.workImgAnimation}
							src={mq.tabs ? image.srcSP : image.srcPC}
							alt="Picture of the author"
							w="100%"
							h="100%"
							mah="50em"
							width={image.widthPC}
							height={image.heightPC}
							sx={{ objectFit: "cover" }}
						/>
					</Carousel.Slide>
				))}
			</Carousel>
		</Box>
	);
}
