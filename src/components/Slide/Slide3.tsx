import Image from "next/future/image";

import { useState, useEffect, useRef, MutableRefObject, SetStateAction, Dispatch } from "react";

import { c } from "../../styles/eStyle";

import { SlideBase } from "./SlideBase";

import { SlideFlyerSample } from "../Slide/SlideFlyerSample";
import { Anchor, Box, CSSObject, Flex, Modal, Title, UnstyledButton } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";
import { ExButton } from "../UILib/extendMantine";

export const Slide3 = ({ toggleOpenFlyerSample }: { toggleOpenFlyerSample: (value?: SetStateAction<boolean>) => void }) => {
	//
	const { mq } = useMQ();

	// const [openFlyerSample, setOpenFlyerSample] = useState(true);

	const getRGBAColor = (color: string) => {
		if (color[0] !== "#" || color.length !== 7) {
			return "rgba(94, 188, 146, 0.15)";
		}

		const str = color.replace("#", "").match(/.{2}/g);
		let c1;
		let c2;
		let c3;

		if (str && str.length === 3) {
			c1 = parseInt(str[0], 16);
			c2 = parseInt(str[1], 16);
			c3 = parseInt(str[2], 16);
		}

		return `rgba(${c1}, ${c2}, ${c3}, 0.4)`;
	};

	const wrapper: CSSObject = {
		// marginTop: "3vw",
		// display: "flex",
		// justifyContent: "center",
		// alignSelf: "stretch",

		h3: {
			marginTop: mq.sp ? "1em" : "2em",
			textAlign: "center",
			fontSize: mq.sp ? "1em" : "min(3vw, 3em)",
		},

		// ${bp.sp} {
		//     flexDirection: "column",
		// }
	};

	const webWrapper = {
		width: mq.sp ? "100%" : "48%",
		flexGrow: 1,
		backgroundColor: `${getRGBAColor(c.l2_green)}`,
		borderRadius: "1em",
		fontSize: "1.5em",
		h3: {
			color: `${c.green}`,
		},
	};

	const flyerWrapper = {
		width: mq.sp ? "100%" : "48%",
		backgroundColor: `${getRGBAColor(c.l2_pink)}`,
		borderRadius: "1em",
		fontSize: "1.5em",
		flexGrow: 1,
		marginTop: mq.sp ? "2em" : "initial",
		h3: {
			color: `${c.orange}`,
		},
	};

	// const flyImage = {
	// 	height: mq.sp ? "initial" : "54vw",
	// 	maxHeight: "420px",
	// 	width: "65%",
	// 	margin: "0 auto",
	// 	marginTop: "1em",
	// 	marginBottom: mq.sp ? "1.5em" : "initial",
	// 	overflow: "hidden",
	// 	filter: "drop-shadow(0.2em 0.2em 0.1em rgba(0, 0, 0, 0.6))",
	// 	// cursor: "pointer",
	// 	"&:hover": { opacity: 0.7 },
	// 	// ${bp.sp} {
	// 	//     height: initial;
	// 	//     margin-bottom: 1.5em;
	// 	// }
	// };

	const flyImage: CSSObject = {
		width: "65%",
		margin: "0 auto",
		marginTop: "1em",
		marginBottom: mq.sp ? "2em" : "initial",
		height: mq.sp ? "initial" : "53vw",
		maxHeight: mq.sp ? "initial" : "420px",
		overflow: "hidden",
		filter: "drop-shadow(4px 4px 3px rgba(0,0,0,0.3))",
		"&:hover": { opacity: 0.7 },
	};

	return (
		<>
			<Title order={2} sx={{ fontSize: mq.sp ? "1.1em" : "initial" }}>
				webサイトとチラシの内容について
			</Title>
			<Box component="p" sx={{ fontSize: mq.sp ? "10px" : "1em", lineHeight: "1.5em" }}>
				webサイトと、チラシのイメージは以下のようになります。
			</Box>
			<Flex mt="3em" justify="space-around" direction={mq.sp ? "column" : "row"} gap="1em" sx={wrapper}>
				<Flex direction="column" sx={webWrapper}>
					<h3>webサイト</h3>
					<Box sx={flyImage}>
						<Anchor href="https://sample.pick-yoga.com" target="_blank" rel="noopener noreferrer">
							<Box component={Image} src="/img/image_web.png" width={309} height={516} alt="webサイトのイメージ" w="100%" h="auto" />
						</Anchor>
					</Box>

					<Box mb="2em">
						<ExButton
							component="a"
							display="block"
							color={c.green}
							radius="0.6em"
							w="80%"
							h="2.5em"
							m="0 auto"
							fz="0.8em"
							fw="normal"
							href="https://sample.pick-yoga.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							プレビュー
						</ExButton>
					</Box>
				</Flex>
				<Flex direction="column" sx={flyerWrapper}>
					<h3>チラシ</h3>
					<Box sx={flyImage}>
						<UnstyledButton
							onClick={() => {
								toggleOpenFlyerSample();
							}}
						>
							<Box component={Image} src="/img/image_flyer.png" width={258} height={364} w="100%" h="auto" alt="チラシのイメージ" />
						</UnstyledButton>
					</Box>
					<ExButton
						display="block"
						color={c.orange}
						radius="0.6em"
						w="80%"
						h="2.5em"
						m="0 auto"
						fz="0.8em"
						fw="normal"
						onClick={() => {
							toggleOpenFlyerSample();
						}}
					>
						プレビュー
					</ExButton>
				</Flex>
			</Flex>

			{/* <Modal
				size="xl"
				opened={openFlyerSample}
				onClose={() => {
					setOpenFlyerSample(false);
				}}
			>
				<SlideFlyerSample setWinOpen={setOpenFlyerSample} />
			</Modal> */}

			{/* {openFlyerSample && <SlideFlyerSample setWinOpen={setOpenFlyerSample} />} */}
		</>
	);
};
