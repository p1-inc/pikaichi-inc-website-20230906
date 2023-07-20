/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { bp } from "../../styles/eStyle";
import { SlideBase } from "./SlideBase";
import { Box } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";
import { MutableRefObject } from "react";

type slideProps = {
	ref: MutableRefObject<any>;
	displayPage: any;
	setDisplayPage: any;
	setWinOpen: any;
};

export const Slide2 = () => {
	const { mq } = useMQ();
	return (
		// <SlideBase d={1} color="#E36234" btnBack={true} btnNext={true}>
		<>
			<h2>
				<span>当サービスはヨガスタジオ専門の</span>
				<span>webサイト・チラシ制作サービスです。</span>{" "}
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
				<span>新しくヨガ教室を始めるインストラクターさんにとって、</span>
				<span>自身で運営する教室にビジョンや夢がある一方、</span>
				<span>どうしても集客への不安があると思います。</span>
				<span>どれだけレッスン自信があったとしても、</span>
				<span>自分を知ってもらわないと運営は安定しません。</span>
				<br />
				<br />
				<span>一般的に、ヨガスタジオは半径3km圏内に居住する </span>
				<span>お客様がターゲットといわれています。</span>
				<span>SNSや口コミで発信するインストラクターさんも</span>
				<span>多いと思いますが、</span>
				<span>近距離のお客様にリーチするためには、</span>
				<span>チラシを配布することが最も有効な告知になることでしょう。</span>
				<br />
				<br />
				<span>しかし、詳しい情報を発信し、</span>
				<span>ヨガスタジオを探して比較検討されているお客様に</span>
				<span>リーチするためにはどうしても</span>
				<span>チラシだけでは情報が足りません。</span>
				<br />
				<br />
				<span>そこでwebサイトを制作し、</span>
				<span>場所、時間、料金設定やレッスンの雰囲気など</span>
				<span>利用者が知りたい情報を詳細に発信していく必要があります。 </span>
				<span>つまり新規のお客様にとっては、</span>
				<span>チラシで知って、webサイトで比較検討するというのが</span>
				<span>主な加入までへの流れです。</span>
				<br />
				<br />
				<span>これから新しく始めるヨガスタジオ・インストラクターさんにむけて、</span>
				<span>チラシとwebサイトを提供し、</span>
				<span>より安心してレッスンの運営できるように</span>
				<span>お手伝いします。</span>
			</Box>
		</>
		// </SlideBase>
	);
};
