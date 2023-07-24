/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef, MutableRefObject } from "react";
import Image from "next/future/image";

import { c, f } from "../styles/eStyle";

import { useWindowSize } from "../hooks/useWindowSize";
import { Anchor, Box, Button, CSSObject, Flex, Text, Title, UnstyledButton, keyframes } from "@mantine/core";
import { useMQ } from "../hooks/useMQ";
import { useScrollIntoView } from "@mantine/hooks";
import { ExButton } from "./UILib/extendMantine";

// import { Kiwi_Maru } from "@next/font/google";
// const Kiwi_Maru_normal = Kiwi_Maru({
// 	weight: "400",
// 	subsets: ["cyrillic"],
// });
// console.log("Kiwi_Maru_normal.className: ", Kiwi_Maru_normal.className);

export default function Topview({ scrollIntoView, contactRef }: { scrollIntoView: any; contactRef: MutableRefObject<HTMLDivElement> }) {
	//
	const { windowWidth, windowHeight } = useWindowSize();

	const { mq } = useMQ();
	const ref = useRef();

	//パララックスのスピードの設定[初期位置,移動係数]
	const bg_01_init = [40, 5];
	const bg_02_init = [40, 2];
	const bg_03_init = [40, -2];
	const fukidashi_init = [49, -2];
	const woman_01_init = [52, -1];
	const table_01_init = [56, -18];
	const clock_01_init = [41, -30];
	const plant_01_init = [60, -17.5];
	const plant_02_init = [60, -15];
	const book_01_init = [40, -28];
	const star_01_init = [10, -28];
	const star_02_init = [10, -28];
	const star_03_init = [35, -28];
	const star_04_init = [28, -28];
	const star_05_init = [48, -28];
	const star_06_init = [39, -28];
	const star_07_init = [41, -28];
	const star_08_init = [50, -28];
	const star_09_init = [61, -28];

	const [positionY, setPositionY] = useState(0);
	const [windowW, setWindowW] = useState(0);

	const [wRetio, setWRetio] = useState(1);

	const [bg_01_Y, setBg_01_Y] = useState<number>();
	const [bg_02_Y, setBg_02_Y] = useState<number>();
	const [bg_03_Y, setBg_03_Y] = useState<number>();
	const [fukidashi_Y, setFukidashi_Y] = useState<number>();
	const [woman_01_Y, setWoman_01_Y] = useState<number>();
	const [table_01_Y, setTable_01_Y] = useState<number>();
	const [clock_01_Y, setClock_01_Y] = useState<number>();
	const [plant_01_Y, setPlant_01_Y] = useState<number>();
	const [plant_02_Y, setPlant_02_Y] = useState<number>();
	const [book_01_Y, setBook_01_Y] = useState<number>();
	const [star_01_Y, setStar_01_Y] = useState<number>();
	const [star_02_Y, setStar_02_Y] = useState<number>();
	const [star_03_Y, setStar_03_Y] = useState<number>();
	const [star_04_Y, setStar_04_Y] = useState<number>();
	const [star_05_Y, setStar_05_Y] = useState<number>();
	const [star_06_Y, setStar_06_Y] = useState<number>();
	const [star_07_Y, setStar_07_Y] = useState<number>();
	const [star_08_Y, setStar_08_Y] = useState<number>();
	const [star_09_Y, setStar_09_Y] = useState<number>();

	useEffect(() => {
		setWindowW(window.innerWidth);
		setWRetio(450 / window.innerWidth);

		const onResize = () => {
			setWRetio(450 / window.innerWidth);
		};

		const onScroll = () => {
			setPositionY(window.pageYOffset);
		};

		window.addEventListener("scroll", onScroll);
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		setBg_01_Y(bg_01_init[0] - positionY * bg_01_init[1] * 0.003 * wRetio);
		setBg_02_Y(bg_02_init[0] - positionY * bg_02_init[1] * 0.003 * wRetio);
		setBg_03_Y(bg_03_init[0] - positionY * bg_03_init[1] * 0.003 * wRetio);
		setFukidashi_Y(fukidashi_init[0] - positionY * fukidashi_init[1] * 0.003 * wRetio);
		setWoman_01_Y(woman_01_init[0] - positionY * woman_01_init[1] * 0.003 * wRetio);
		setTable_01_Y(table_01_init[0] - positionY * table_01_init[1] * 0.003 * wRetio);
		setClock_01_Y(clock_01_init[0] - positionY * clock_01_init[1] * 0.003 * wRetio);
		setPlant_01_Y(plant_01_init[0] - positionY * plant_01_init[1] * 0.003 * wRetio);
		setPlant_02_Y(plant_02_init[0] - positionY * plant_02_init[1] * 0.003 * wRetio);
		setBook_01_Y(book_01_init[0] - positionY * book_01_init[1] * 0.003 * wRetio);
		setStar_01_Y(star_01_init[0] - positionY * star_01_init[1] * 0.003 * wRetio);
		setStar_02_Y(star_02_init[0] - positionY * star_02_init[1] * 0.003 * wRetio);
		setStar_03_Y(star_03_init[0] - positionY * star_03_init[1] * 0.003 * wRetio);
		setStar_04_Y(star_04_init[0] - positionY * star_04_init[1] * 0.003 * wRetio);
		setStar_05_Y(star_05_init[0] - positionY * star_05_init[1] * 0.003 * wRetio);
		setStar_06_Y(star_06_init[0] - positionY * star_06_init[1] * 0.003 * wRetio);
		setStar_07_Y(star_07_init[0] - positionY * star_07_init[1] * 0.003 * wRetio);
		setStar_08_Y(star_08_init[0] - positionY * star_08_init[1] * 0.003 * wRetio);
		setStar_09_Y(star_09_init[0] - positionY * star_09_init[1] * 0.003 * wRetio);
	}, [positionY]);

	const flffy = keyframes({
		"0%": {
			transform: "translate(-50%, -50%) scale(1)",
		},
		"25%": {
			transform: "translate(-50%, -50%) scale(1.02, 1.06)",
		},
		"50%": {
			transform: "translate(-50%, -50%) scale(1, 1)",
		},
		"75%": {
			transform: "translate(-50%, -50%) scale(1.06, 1.02)",
		},
		"100%": {
			transform: "translate(-50%, -50%) scale(1)",
		},
	});

	const vibrate1 = keyframes({
		"0%": {
			transform: "translate(-50%, -50%) scale(1)",
		},
		"20%": {
			transform: "translate(-52%, -48%) scale(1)",
		},
		"40%": {
			transform: "translate(-52%, -52%) scale(1)",
		},
		"60%": {
			transform: "translate(-48%, -48%) scale(1)",
		},
		"80%": {
			transform: "translate(-48%, -52%) scale(1)",
		},
		"100%": {
			transform: "translate(-50%, -50%) scale(1)",
		},
	});

	const topview = {
		backgroundColor: "rgba(246, 204, 214, 0.4)",
		maskImage: 'url("/img/background_01.svg")',
		maskRepeat: "no-repeat",
		maskSize: "100% ${windowWidth * 0.8 < 800 ? windowWidth * 0.8",
	};

	const loginBtn = {
		label: "loginBtn",
		padding: "0.3em 1em ",
		fontSize: "0.8em",
		color: c.mainPurple,
		border: `1px solid ${c.mainPurple}`,
		borderRadius: "0.3em",
		fontFamily: f.fontfamily_jp_01,
		"&:hover": { textDecoration: "none", opacity: 0.5 },
	};

	const wrapper: CSSObject = {
		label: "wrapper",
		position: "relative",
		top: "9",
		width: "90%",
		maxWidth: "900px",
		margin: "0 auto",
		marginTop: "0.5em",
		height: "90vw",
		maxHeight: "800px",
	};

	const topWord_h1: CSSObject = {
		textAlign: "center",
		color: "#f76430",
		fontFamily: "Kiwi Maru, serif",
		fontSize: "min(4vw, 2em)",
	};

	const topWord_h2: CSSObject = {
		textAlign: "center",
		color: "#1d2088",
		fontFamily: "Kiwi Maru, serif",
		fontSize: "min(3.5vw, 1.5em)",
	};

	const bg_02: CSSObject = {
		position: "absolute",
		transform: "translate(-50%, -50%)",
		width: "90%",
		top: `${bg_01_Y}%`,
		left: "50%",
		animation: `${flffy} 12s ease-in-out infinite alternate`,
	};

	const bg_03: CSSObject = {
		width: "80%",
		position: "absolute",
		top: `${bg_02_Y}%`,
		left: "50%",
		transform: "translate(-50%, -50%)",
		animation: `${flffy} 10s ease-in-out infinite alternate`,
	};

	const bg_04: CSSObject = {
		width: "60%",
		position: "absolute",
		top: `${bg_03_Y}%`,
		left: "50%",
		transform: "translate(-50%, -50%)",
		animation: `${flffy} 8s ease-in-out infinite alternate`,
	};

	const fukidashi: CSSObject = {
		width: "19%",
		position: "absolute",
		top: `${fukidashi_Y}%`,
		left: "80%",
		transform: "translate(-50%, -50%)",
		animation: `${flffy} 8s ease-in-out infinite alternate`,
	};

	const woman_01: CSSObject = {
		width: "22%",
		position: "absolute",
		top: `${woman_01_Y}%`,
		left: "50%",
		transform: "translate(-50%, -50%)",
		zIndex: 100,
		animation: `${vibrate1} 4s ease-in-out infinite alternate-reverse both`,
	};

	const table_01: CSSObject = {
		width: "38%",
		position: "absolute",
		top: `${table_01_Y}%`,
		left: "50%",
		transform: "translate(-50%, -50%)",
		zIndex: 110,
		animation: `${vibrate1} 10s ease-in-out infinite alternate-reverse both`,
	};

	const clock_01: CSSObject = {
		width: "6%",
		position: "absolute",
		top: `${clock_01_Y}%`,
		left: "25%",
		transform: "translate(-50%, -30%)",
		zIndex: 10,
		animation: `${vibrate1} 2s ease-in-out infinite alternate-reverse both`,
	};

	const plant_01: CSSObject = {
		width: "5%",
		position: "absolute",
		top: `${plant_01_Y}%`,
		left: "20%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 4s ease-in-out infinite alternate-reverse both`,
	};

	const plant_02: CSSObject = {
		width: "10%",
		position: "absolute",
		top: `${plant_02_Y}%`,
		left: "80%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const book_01: CSSObject = {
		width: "10%",
		position: "absolute",
		top: `${book_01_Y}%`,
		left: "38%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_01: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_01_Y}%`,
		left: "20%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_02: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_03_Y}%`,
		left: "79%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_03: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_03_Y}%`,
		left: "10%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_04: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_04_Y}%`,
		left: "91%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_05: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_05_Y}%`,
		left: "15%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_06: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_06_Y}%`,
		left: "57%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_07: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_07_Y}%`,
		left: "70%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_08: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_08_Y}%`,
		left: "85%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	const star_09: CSSObject = {
		width: "4%",
		position: "absolute",
		top: `${star_09_Y}%`,
		left: "6%",
		transform: "translate(-50%, -50%)",
		animation: `${vibrate1} 5s ease-in-out infinite alternate-reverse both`,
	};

	return (
		<Box w="100%" m="0 auto" sx={topview} ref={ref}>
			<Flex w="90%" align="flex-start" justify="space-between" m="0 auto" pt="2em" sx={{ zIndex: 100000 }} pos="relative">
				<Flex w={mq.sp ? "4em" : "6em"}>
					<Box component={Image} src="/img/logo_top2.svg" width={137} height={137} alt="ロゴ" w="100%" h="100%" sx={{ objectFit: "cover" }} />
				</Flex>
				<Flex align="center" justify="center" mt="1em" gap="1em">
					<UnstyledButton
						fz={mq.sp ? "0.8em" : "1em"}
						sx={{ color: c.mainPurple, fontFamily: f.fontfamily_en_01 }}
						onClick={() =>
							scrollIntoView({
								alignment: "center",
							})
						}
					>
						CONTACT
					</UnstyledButton>
					<Anchor sx={{ "&:hover": { textDecoration: "none" } }} href="/posts/postIndex" target="_blank" rel="noopener noreferrer">
						<Text fz={mq.sp ? "0.8em" : "1em"} sx={{ color: c.mainPurple, fontFamily: f.fontfamily_en_01 }}>
							BLOG
						</Text>
					</Anchor>
					<Anchor
						w={mq.sp ? "1.2em" : "1.8em"}
						href="https://twitter.com/share?url=https://pick-yoga.com/&text=これからスタジオを始めるインストラクターさんのためのヨガ専門webサイト・チラシ制作サービス"
					>
						<Box component={Image} src="/img/sns_tw.svg" width={30} height={30} w="100%" h="100%" alt="twitter" />
					</Anchor>
					<Anchor sx={loginBtn} href="/admin/index" target="_blank" rel="noopener noreferrer">
						<Box>ログイン</Box>
					</Anchor>
					{/* <ExButton variant="outline" size="xs" color={c.mainPurple}>
						ログイン
					</ExButton> */}
				</Flex>
			</Flex>
			<Box sx={wrapper}>
				<Box component={Image} sx={bg_02} src="/img/background_02.svg" width={1348} height={1161} alt="" />
				<Box component={Image} sx={bg_03} src="/img/background_03.svg" width={1201} height={1034} alt="" />
				<Box component={Image} sx={bg_04} src="/img/background_04.svg" width={875} height={754} alt="" />
				<Box component={Image} sx={woman_01} src="/img/woman_01.svg" width={296} height={283} alt="" />
				<Box component={Image} sx={table_01} src="/img/table_01.svg" width={587} height={277} alt="" />
				<Box component={Image} sx={clock_01} src="/img/clock_01.svg" width={62} height={60} alt="" />
				<Box component={Image} sx={plant_01} src="/img/plant_01.svg" width={54} height={114} alt="" />
				<Box component={Image} sx={plant_02} src="/img/plant_02.svg" width={157} height={173} alt="" />
				<Box component={Image} sx={book_01} src="/img/book_01.svg" width={104} height={21} alt="" />
				<Box component={Image} sx={star_01} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_02} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_03} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_04} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_05} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_06} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_07} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_08} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={star_09} src="/img/star.svg" width={65} height={78} alt="" />
				<Box component={Image} sx={fukidashi} src="/img/fukidashi.svg" width={307} height={195} alt="" />
				<Box pos="relative" w="60%" maw="1200px" top={0} m="2em auto">
					<Box pos="relative" w="1005" sx={{ zIndex: 300 }}>
						<Title order={2} sx={topWord_h2}>
							これからスタジオを始める
						</Title>
						<Title order={2} sx={topWord_h2}>
							インストラクターさんへ
						</Title>
					</Box>
					<Box
						component={Image}
						pos="relative"
						mt="1em"
						sx={{ zIndex: 300 }}
						src="/img/mainLogo.svg"
						alt="ヨガ専門"
						width={136.96}
						height={18.89}
						w="100%"
						h="100%"
					/>

					<Box pos="relative" mt="0.5em" w="100%">
						<Title order={1} sx={topWord_h1}>
							webサイト・チラシ制作
						</Title>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
