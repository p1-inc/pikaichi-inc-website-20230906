/** @jsxImportSource @emotion/react */

import { useCallback, useRef } from "react";

import NextImage from "next/future/image";

import { ActionIcon, Anchor, Box, Button, Flex, createStyles, keyframes } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType, EmblaPluginType, EmblaEventType, UseEmblaCarouselType } from "embla-carousel-react";

import { WorksDataType } from "../data/worksData";
import { useRespStyles } from "../hooks/useRespStyles";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
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

	//
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ active: true, delay: 10000 })]);

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
		<Box pos="relative" ref={containerRef} w="100%">
			<Box component="div" ref={emblaRef} sx={{ overflow: "hidden" }}>
				<Flex>
					{images.map((image, index) => (
						<Flex key={image.id} w="100%" h={mq.tab ? "90vw" : "85vh"} sx={{ flex: "0 0 100%", minWidth: 0, overflow: "hidden" }}>
							<Anchor href={`works/${image.id}`} w="100%">
								<Box
									component={NextImage}
									className={classes.workImgAnimation}
									src={mq.tabs ? image.srcSP : image.srcPC}
									alt="Picture of the author"
									w="100%"
									h="100%"
									width={image.widthPC}
									height={image.heightPC}
									sx={{ objectFit: "cover", "&:hover": { opacity: 1 } }}
								/>
							</Anchor>
						</Flex>
					))}
				</Flex>
			</Box>
			<Flex align="center" justify="space-between" px="0.75rem" pos="absolute" sx={{ left: 0, right: 0, top: "calc(50% - (8em / 2))" }}>
				<ActionIcon radius="xl" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={scrollPrev}>
					<IconChevronLeft width="2em" />
				</ActionIcon>
				<ActionIcon radius="xl" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} onClick={scrollNext}>
					<IconChevronRight />
				</ActionIcon>
			</Flex>
		</Box>
	);
}
