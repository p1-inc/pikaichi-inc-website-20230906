/** @jsxImportSource @emotion/react */

import { useCallback, useRef } from "react";

import NextImage from "next/future/image";

import { Box, Button, Flex, createStyles, keyframes } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType, EmblaPluginType, EmblaEventType, UseEmblaCarouselType } from "embla-carousel-react";

import { WorksDataType } from "../data/worksData";
import { useRespStyles } from "../hooks/useRespStyles";
// import useEmblaCarousel from "embla-carousel-react";

// import Autoplay from "embla-carousel-autoplay/components/Autoplay";

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

	const [emblaRef, emblaApi] = useEmblaCarousel({ active: true, loop: true }, [Autoplay()]);
	// const autoplay = useRef(Autoplay({ delay: 2000 }));
	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const useStyles = createStyles((theme) => ({
		workImgAnimation: {
			transformOrigin: "80% 80%",
			animation: `${bounce} 20s  infinite`,
		},
	}));

	const { classes } = useStyles();

	return (
		<Box pos="relative" ref={containerRef} w="100%" h={mq.tabs ? "90vw" : "100vh"} mah="50em" sx={{ overflow: "hidden" }}>
			<Box component="div" ref={emblaRef} sx={{ overflow: "hidden" }}>
				<Flex>
					{images.map((image, index) => (
						<Flex key={image.id} sx={{ flex: "0 0 100%", minWidth: 0, overflow: "hidden" }}>
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
						</Flex>
					))}
				</Flex>
			</Box>
			<Flex align="center" justify="space-between" px="0.75rem" pos="absolute" sx={{ left: 0, right: 0, top: "calc(50% - 1.625rem / 2)" }}>
				<Button sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={scrollPrev}>
					Prev
				</Button>
				<Button sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={scrollNext}>
					Next
				</Button>
			</Flex>
			{/* <Carousel loop mx="auto" withIndicators plugins={[autoplay.current]} w="100%" height={mq.tabs ? "90vw" : "100vh"} mah="50em" sx={{ overflow: "hidden" }}>
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
			</Carousel> */}
		</Box>
	);
}
