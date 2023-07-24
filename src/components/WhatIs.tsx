import Image from "next/future/image";

import { Box, CSSObject, Title, Text } from "@mantine/core";
import { useRespStyles } from "../hooks/useRespStyles";
import { useRef } from "react";

export default function WhatIs() {
	//
	const containerRef = useRef<HTMLDivElement>(null);

	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 799 });

	const imageStyle_width = () => {
		if (mq.sp) {
			return "90vw";
		} else if (mq.max) {
			return "800px";
		} else {
			return "50vw";
		}
	};

	const imageStyle = {
		display: "block",
		width: imageStyle_width(),
		margin: "0 auto",
	};

	const copy_s: CSSObject = {
		fontSize: clp("0.8em", "1.4em"),
		lineHeight: clp("2em", "3.2em"),
		width: "68%",
		margin: "0 auto",
		marginTop: "1.6em",
		fontWeight: "normal",
	};

	const copy_ss: CSSObject = {
		fontSize: clp("1em", "1.3em"),
		lineHeight: mq.sp ? "1.5em" : "max(2vw, 1em)",
		textAlign: "center",
		margin: "0 auto",
		color: "#f76430",
	};

	const copy_wrapper = {
		display: "flex",
		// width: mq.sp ? "90vw" : "50vw",
		margin: "0 auto",
		marginTop: "1em",
	};

	return (
		<Box mb="7em" maw="799px" m="0 auto" ref={containerRef}>
			<Title order={2} fz={clp("1em", "1.8em")} fw="normal" ta="center">
				<span>なぜwebサイトとチラシを</span>
				<span>セットにするのですか？</span>
			</Title>
			<Title order={2} sx={copy_s}>
				新しくヨガ教室を始めるインストラクターさんにとって、自身で運営する教室にビジョンや夢がある一方、どうしても集客への不安があると思います。どれだけレッスン自信があったとしても、自分を知ってもらわないと運営は安定しません。
			</Title>

			<Box mt="2em" mb="1em">
				<Text component="p" sx={copy_ss}>
					<span>ヨガ入会までの</span>
					<span>一般的なプロセス</span>
				</Text>
			</Box>

			<Box component={Image} sx={imageStyle} src="/img/flyerOrweb.png" width={1200} height={568} w="85%" h="auto" alt="" />

			<Box sx={copy_wrapper}>
				<Text component="p" sx={copy_ss} fz={clp("0.8em", "1em")}>
					チラシで
					<br />
					興味をもつ
				</Text>
				<Text component="p" sx={copy_ss} fz={clp("0.8em", "1em")}>
					webサイトで
					<br />
					じっくり検討
				</Text>
			</Box>

			<Text component="p" sx={copy_s}>
				<span>一般的に、ヨガスタジオは半径3km圏内に居住するお客様がターゲットといわれています。</span>
				<span>集客のためにSNSや口コミで発信するインストラクターさんも多いと思いますが、</span>
				<span>近距離のお客様にリーチするためには、チラシを配布することが最も有効な告知になることでしょう。</span>
				<span>しかし、ヨガスタジオを探して比較検討されているお客様にリーチするためにはどうしてもチラシだけでは情報が足りません。</span>
				<span>そこでwebサイトを制作し、場所、時間、料金設定やレッスンの雰囲気など利用者が知りたい情報を詳細に発信していく必要があります。</span>
			</Text>

			<Text component="p" sx={copy_s}>
				<span>つまり新規のお客様にとっては、チラシで知って、webサイトで比較検討するというのが主な加入までへの流れです。</span>
			</Text>

			<Text component="p" sx={copy_s}>
				<span>
					私たちは、これから新しく始めるヨガスタジオ・インストラクターさんにむけて、チラシとwebサイトを低価格で提供し、より安心してスタジオの運営できるようにサポートします。
				</span>
			</Text>
		</Box>
	);
}
