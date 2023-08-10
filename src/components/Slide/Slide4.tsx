import Image from "next/future/image";

import { c } from "../../styles/eStyle";

import { Box, Text } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";

export const Slide4 = () => {
	const { mq } = useMQ();
	const image = {
		marginTop: "2em",
		width: mq.sp ? "20em" : "30em",
	};

	return (
		<>
			<h2>
				<span>費用に関して</span>
			</h2>
			<Box
				component="p"
				sx={{
					span: {
						fontSize: mq.sp ? "10px" : "1em",
						lineHeight: "1.8em",
					},
				}}
			>
				<span>当サービスの費用は、1プランのみです。 。</span> <br />
				<span> 月額4,980円で、</span> <span>初回のみ29,980円〜になります。</span> <br />
			</Box>
			<Box sx={image}>
				<Box component={Image} src="/img/slide_4_Image.png" width={805} height={171} w="100%" alt="更新のイメージ図" sx={{ objectFit: "contain" }} />
			</Box>
			<Box
				component="p"
				sx={{
					span: {
						fontSize: mq.sp ? "10px" : "1em",
						lineHeight: "1.8em",
					},
				}}
			>
				<br />
				<span> 料金に含まれる内容は、</span> <br />
				<span>初回チラシ作成、web作成になります。</span> <br />
				<span>その他、ロゴ作成、</span> <span>写真撮影などは別料金になります。</span> <br />
				<br />
				<span>追加で費用が発生する場合は、</span> <br />
				<span>事前にお客様にご連絡し、</span> <span>了承を得てから制作進行しますので、</span> <br />
				<span>納品後に「こんなにかかるなんて知らなかった」</span> <span>なんてことがありません。</span> <br />
			</Box>
		</>
	);
};
