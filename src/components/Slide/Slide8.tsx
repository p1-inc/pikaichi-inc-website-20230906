import Image from "next/future/image";

import { mqN, mqTitle, f, c, bp, bpMin } from "../../styles/eStyle";

import Contact from "../Contact";
import { Box } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";

export const Slide8 = () => {
	//
	const { mq } = useMQ();

	return (
		// <SlideBase id={7} color="#1976d2" displayPage={displayPage} setDisplayPage={setDisplayPage} btnBack={true} btnNext={false} setWinOpen={setWinOpen}>
		<>
			<h2>
				<span>以上でクイックスタートは終わりです</span>
			</h2>
			<Box
				component="p"
				sx={{
					span: {
						fontSize: mq.sp ? "10px" : "1em",
						lineHeight: "2em",
					},
				}}
			>
				<span>もっと詳しくお聞きしたい方や、</span> <br />
				<span>お申し込みの方は以下のフォームからアクセスしてください</span> <br />
			</Box>
			<Box ta="center" fz="0.8em" mt="1em">
				<Contact />
			</Box>

			<Box mt="4em">
				<Box component="p" fz="1em" lh="1.8em">
					<span>下記メールでも承ります</span> <br />
					<span>contact@pick-yoga.com</span> <br />
				</Box>
				<Box mt="1em" w="10em">
					<Box component={Image} src="/img/logo_pickyoga_typeH.svg" width={236} height={40} w="100%" alt="webサイトのイメージ" />
				</Box>

				<Box component="p" mt="0.5em" ta="left">
					運営：ピックヨガ
				</Box>
			</Box>
		</>
	);
};
