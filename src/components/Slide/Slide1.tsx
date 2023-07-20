import { SlideBase } from "./SlideBase";

import { bp } from "../../styles/eStyle";
import { Box, Title } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";
import { useElementSize } from "@mantine/hooks";
import { useEffect } from "react";

type slideProps = {
	displayPage: any;
	setDisplayPage: any;
	setWinOpen: any;
};

export const Slide1 = () => {
	const { mq } = useMQ();

	return (
		// <SlideBase id={0} color="#e97ab1" displayPage={displayPage} setDisplayPage={setDisplayPage} btnBack={false} btnNext={true} setWinOpen={setWinOpen}>
		<Box>
			<Title order={2}>クイックスタート</Title>
			<Box
				component="p"
				sx={{
					span: {
						fontSize: mq.sp ? "10px" : "1em",
						lineHeight: "2em",
					},
				}}
			>
				<span>クイックスタートを御覧いただき</span>
				<span>ありがとうございます。</span> <br />
				<br />
				<span>当サービスはヨガスタジオ専門の</span>
				<span>webサイト・チラシ制作サービスです。</span> <br />
				<br />
				<span>これからサービスの中身について、</span>
				<span> できるだけわかりやすく簡単にご説明します。</span> <br />
				<br />
				<span>ただ、webサイトに書いてあることと</span> <br />
				<span>重複する部分がありますので、</span>
				<span>もし、説明が不要な方は読み飛ばしてください</span> <br />
				<br />
				<span>また、こちらを見ていただいても、</span>
				<br />
				<span>ただちに請求が発生することはありません。</span> <br />
				<br />
				<span>ご説明を見てみて</span>
				<span>当サービスをご検討したい方は、</span> <br />
				<span> 最後にお問合わせ・</span>
				<span> 申込みフォームがありますので、</span> <br />
				<span>そちらからお申し込みください。</span> <br />
			</Box>
		</Box>
		// </SlideBase>
	);
};
