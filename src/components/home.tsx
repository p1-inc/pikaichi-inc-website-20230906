import fs from "fs";
import path from "path";
import sizeOf from "image-size";

import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Flex, Transition } from "@mantine/core";
import Head from "next/head";

import Footer from "../components/Footer";
import { Box, Modal, createStyles, getStylesRef, rem, keyframes } from "@mantine/core";
import { useScrollIntoView, useToggle } from "@mantine/hooks";
import P1_Slider2 from "../components/P1_Slider2";
import { useEffect, useRef, useState } from "react";
import { MediaLib } from "../types/types";
import { WorksCard } from "../components/worksCard";
import { WorksDataType, worksData } from "../data/worksData";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { HeaderArea } from "../components/header";
import { Profile } from "../components/profile";
import { Company } from "../components/company";
import { Contact } from "../components/contact";

export const Home = ({ workImageData: originalItems }: { workImageData: WorksDataType[] }) => {
	//

	const [items, setItems] = useState([]);

	useEffect(() => {
		const shuffleArray = (array: WorksDataType[]) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		};

		setItems(shuffleArray([...originalItems]));
	}, [originalItems]);

	return (
		<AuthWrapper>
			<Box component="main" fz="1rem">
				<Flex w="90%" m="0 auto" mt="3em">
					<HeaderArea />
				</Flex>
				<Flex mt="3em">
					<P1_Slider2 images={items} />
				</Flex>
				<Flex justify="center" mt="2em">
					<PikaichistarSVG width="2em" />
				</Flex>

				<WorksCard items={items} mt="1em" />
				<Flex w="80%" mx="auto" mt="3em" sx={{ overflowWrap: "break-word" }}>
					<Profile />
				</Flex>

				<Flex w="80%" mx="auto" mt="3em" sx={{ overflowWrap: "break-word" }}>
					<Company />
				</Flex>
				<Box mt="10em">
					<Contact />
				</Box>
				<Footer mt="10em" />
			</Box>
		</AuthWrapper>
	);
};
