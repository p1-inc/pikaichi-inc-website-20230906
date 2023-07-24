import Image from "next/future/image";

import { useState, useEffect, useRef, SetStateAction } from "react";

import { c } from "../styles/eStyle";
import { Anchor, Box, CSSObject, Flex, Title, UnstyledButton } from "@mantine/core";
import { ExButton } from "./UILib/extendMantine";
import { useRespStyles } from "../hooks/useRespStyles";

type MqType = {
	sps: boolean;
	sp: boolean;
	spl: boolean;
	tabs: boolean;
	tab: boolean;
	pc: boolean;
	max: boolean;
};

const SubTitle = ({ color, mq, children }: { color: string; mq: MqType; children: React.ReactNode }) => {
	return (
		<Title order={3} mt="2em" ta="center" fz="1.4em" fw="normal" color={color}>
			{children}
		</Title>
	);
};
export default function Sample({ toggleOpenFlyerSample }: { toggleOpenFlyerSample: (value?: SetStateAction<boolean>) => void }) {
	//

	const containerRef = useRef<HTMLDivElement>(null);

	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });
	const { clp: clpSP } = useRespStyles({ ref: containerRef, min: 375, max: 599 });

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

	const webWrapper: CSSObject = {
		backgroundColor: getRGBAColor(c.l2_green),
		width: mq.sp ? "90%" : "40%",
		margin: mq.sp ? "0 auto" : "initial",
		borderRadius: "1em",
	};

	const flyerWrapper = {
		backgroundColor: getRGBAColor(c.l2_pink),
		width: mq.sp ? "90%" : "40%",
		margin: mq.sp ? "0 auto" : "initial",
		borderRadius: "1em",
	};

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

	const sec2: CSSObject = {
		label: "sec2",
		height: mq.sp ? "auto" : clp("9em", "12em"),
		h3: {
			textAlign: "center",
			fontSize: "min(2.5vw, 2.5em)",
		},

		p: {
			textAlign: "center",
			fontSize: mq.sp ? clpSP("0.6em", "1em") : clp("0.6em", "0.8em"),
		},

		img: {
			display: "block",
			width: mq.sp ? "60%" : "85%",
			margin: "0 auto",
			marginTop: "1em",
		},
	};

	const title: CSSObject = {
		label: "title",
		textAlign: "center",
		fontSize: clp("2.5em", "3.3em"),
		fontFamily: "'Futura PT','Futura-PT',sans-serif",
		fontWeight: 500,
	};

	const getFZ = (): string => {
		if (mq.tab) {
			return "1em";
		} else if (mq.sp) {
			return "0.9em";
		} else {
			return "1.2em";
		}
	};
	const bodycopy: CSSObject = {
		label: "bodycopy",
		width: "90%",
		margin: "0 auto",
		marginTop: "1em",
		textAlign: "center",
		fontSize: getFZ(),
		fontWeight: "normal",
		lineHeight: "1.5em",
	};

	//
	const SupplementContent = ({ bc, children }: any) => {
		const supplementStyle: CSSObject = {
			width: "80%",
			margin: "0 auto",
			marginTop: "1em",
			borderRadius: "1em",
			color: "#fff",
			textAlign: "left",
			padding: "1.5em",
			marginBottom: "2em",
			fontSize: mq.sp ? "1em" : "min(1.5vw, 1.3em)",
			fontWeight: "normal",
			backgroundColor: bc,
		};

		return <Box sx={supplementStyle}>{children}</Box>;
	};

	return (
		<>
			<Box w="100%" maw="799px" m="0 auto" mb="9em" sx={{ color: c.mainBlack }} ref={containerRef}>
				<Title order={2} sx={title}>
					Sample
				</Title>

				<Title order={2} sx={bodycopy}>
					<span> webサイトとチラシとサンプルです</span>
					<br />
					<span> プレビューボタンをクリックすると</span>
					<span> サンプルがご覧になれます</span>
				</Title>

				<Flex mt="2em" direction={mq.sp ? "column" : "row"} justify="center" align="stretch" gap="1em">
					<Flex direction="column" w="100%" sx={webWrapper}>
						<SubTitle color={c.green} mq={mq}>
							webサイト
						</SubTitle>

						<Box sx={flyImage}>
							<Anchor href="https://sample.pick-yoga.com" target="_blank" rel="noopener noreferrer">
								<Box component={Image} src="/img/image_web.png" width={309} height={516} w="100%" h="auto" alt="webサイトのイメージ" />
							</Anchor>
						</Box>
						<ExButton
							component="a"
							display="block"
							color={c.green}
							radius="0.6em"
							w="80%"
							h="3em"
							m="0 auto"
							mb="2em"
							fz="1em"
							fw="normal"
							href="https://sample.pick-yoga.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							プレビュー
						</ExButton>

						<Box sx={sec2}>
							<h3>webサイト制作</h3>
							<p>初期費用無し</p>

							<img src="/img/webPrice.svg" alt="" />
						</Box>

						<SupplementContent bc={c.green}>
							サーバー管理費含む
							<br />
							新規ドメインを取得料金含む
							<br />
						</SupplementContent>
					</Flex>
					<Box sx={flyerWrapper}>
						<SubTitle color={c.orange} mq={mq}>
							チラシ
						</SubTitle>
						<Box sx={flyImage}>
							<UnstyledButton
								w="100%"
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
							h="3em"
							m="0 auto"
							mb="2em"
							fz="1em"
							fw="normal"
							onClick={() => {
								toggleOpenFlyerSample();
							}}
						>
							プレビュー
						</ExButton>

						<Box sx={sec2}>
							<h3>チラシ制作</h3>
							<p>A4両面フルカラー100枚</p>
							<img src="/img/flyerPrice.svg" alt="" />

							<p>（デザイン・送料費込）</p>
							<p>簡易校正色付き（レーザープリンタ）</p>
						</Box>

						<SupplementContent bc={c.orange}>
							※ご自身の写真や、スタジオの写真など、 写真素材はお客様の方でご用意ください。 弊社に撮影を依頼したい場合は、 別料金で対応いたします。
							お気軽にご相談ください。
						</SupplementContent>
					</Box>
				</Flex>
			</Box>
		</>
	);
}
