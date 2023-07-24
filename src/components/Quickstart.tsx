import { SetStateAction, useState } from "react";

import { c } from "../styles/eStyle";

import { QuickStartSlide } from "./QuickStartSlide";
import { useMQ } from "../hooks/useMQ";
import { Box, Title, CSSObject, Flex, Modal } from "@mantine/core";
import { ExButton } from "./UILib/extendMantine";
import { SlideFlyerSample } from "./Slide/SlideFlyerSample";
import { useToggle } from "@mantine/hooks";

const ArrowSVG = ({ color, width, height }: any) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.48 30.07" width={width} height={height} preserveAspectRatio="none">
			<title>ArrowSVG </title>
			<polygon points="34.74 30.07 0 0 69.48 0 34.74 30.07" fill={color} />
		</svg>
	);
};

export default function Quickstart({ toggleOpenFlyerSample }: { toggleOpenFlyerSample: (value?: SetStateAction<boolean>) => void }) {
	//
	const [winOpen, setWinOpen] = useState(false);
	// const [openFlyerSample, toggleOpenFlyerSample] = useToggle([false, true]);
	// const [openFlyerSample, setOpenFlyerSample] = useState(true);

	const { mq } = useMQ();

	const quickstart: CSSObject = {
		textAlign: "center",
		margin: "0 auto",
		marginBottom: "20vw",
		width: "80%",
		maxWidth: "800px",
	};

	const body = {
		fontSize: mq.sp ? "1em" : "2vw",
		lineHeight: "1.5em",
		marginBottom: "1vw",
		padding: "1em",
		border: `3px solid ${c.orange}`,
		borderRadius: "0.5em",
	};

	const span = {
		display: mq.sp ? "block" : " inline",
	};

	return (
		<Box w="100%" h="100%">
			<Flex direction="column" align="center" gap="1em" sx={quickstart}>
				<Title order={2} sx={body} w="100%">
					<Box component="span" sx={span}>
						当サービスを検討したい、
					</Box>
					<Box component="span" sx={span}>
						またはもっと詳しい内容をお聞きしたい方は、
					</Box>
					<Box component="span" sx={span}>
						下記クイックスタートから
					</Box>
					<Box component="span" sx={span}>
						お入りください。
					</Box>
					<Box component="span" sx={span}>
						スライド形式で丁寧に
					</Box>
					<Box component="span" sx={span}>
						ご説明いたします。
					</Box>
				</Title>

				<ArrowSVG color={c.orange} width="5em" height="2em" />
				<ExButton
					color={c.orange}
					w="100%"
					size="lg"
					onClick={() => {
						setWinOpen(true);
					}}
					radius="0.7em"
				>
					クイックスタート
				</ExButton>
			</Flex>
			<Modal
				size="xl"
				opened={winOpen}
				onClose={() => {
					setWinOpen(false);
				}}
			>
				<QuickStartSlide toggleOpenFlyerSample={toggleOpenFlyerSample} />
			</Modal>
			{/* <Modal
				size="xl"
				// size="auto"
				opened={openFlyerSample}
				onClose={() => {
					toggleOpenFlyerSample();
				}}
				zIndex={99999999}
				title="クリックして裏返す"
				styles={{ title: { color: "#FFF" }, content: { borderRadius: 0 }, body: { backgroundColor: "#222" }, header: { backgroundColor: "#222" } }}
			>
				<SlideFlyerSample setWinOpen={openFlyerSample} />
			</Modal> */}
		</Box>
	);
}
