import { useState, useEffect, useRef } from "react";
import Image from "next/future/image";

import { Box, Button, CSSObject, Flex, UnstyledButton } from "@mantine/core";

export const SlideFlyerSample = ({ setWinOpen }: { setWinOpen: boolean }) => {
	//
	const [isTurn, setIsTurn] = useState(false);

	const imgFront: CSSObject = {
		label: "imgFront",
		position: "absolute",
		top: "0",
		left: "0",
		WebkitBackfaceVisibility: "hidden",
		backfaceVisibility: "hidden",
		transition: "all 0.3s",
		transform: `  rotateY(${isTurn ? 180 : 0}deg)`,
	};

	const imgBack: CSSObject = {
		label: "imgBack",
		position: "absolute",
		top: 0,
		left: 0,
		WebkitBackfaceVisibility: "hidden",
		backfaceVisibility: "hidden",
		transition: "all 0.3s",
		transform: `rotateY(${isTurn ? 0 : 180}deg)`,
	};

	return (
		<Box w="100%" h="80vh" sx={{ overflow: "hidden" }}>
			<Flex w="100%" pos="relative">
				<UnstyledButton
					onClick={() => {
						setIsTurn(!isTurn);
					}}
				>
					<Flex w="100%" align="center" justify="center" sx={imgFront}>
						<Box
							component={Image}
							width={1190}
							height={1684}
							w="90%"
							h="75vh"
							src="/img/flyer_front.jpg"
							alt="webサイトのイメージ"
							sx={{ objectFit: "contain" }}
						/>
					</Flex>
					<Flex w="100%" align="center" justify="center" sx={imgBack}>
						<Box
							component={Image}
							width={1190}
							height={1684}
							w="90%"
							h="75vh"
							src="/img/flyer_back.jpg"
							alt="webサイトのイメージ"
							sx={{ objectFit: "contain" }}
						/>
					</Flex>
				</UnstyledButton>
			</Flex>
		</Box>
	);
};
