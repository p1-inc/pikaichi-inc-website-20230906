import Image from "next/future/image";

import { Box, Flex } from "@mantine/core";
import { useMQ } from "../../hooks/useMQ";

export const Slide5 = () => {
	//
	const { mq } = useMQ();

	return (
		<>
			<h2>
				<span>webサイトの更新に関して</span>
			</h2>
			<div>
				<Flex direction={mq.sp ? "column" : "row"}>
					<div>
						<Box
							component="p"
							sx={{
								span: {
									fontSize: mq.sp ? "10px" : "1em",
									lineHeight: "1.8em",
									marginRight: "2em",
								},
							}}
						>
							<span>webサイトの料金に関して</span> <br />
							<span>悩ましいのが更新にかかるコストです。</span> <br />
							<br />
							<span>日々のお知らせや、</span> <br />
							<span>レッスンスケジュールの変更、</span> <br />
							<span>料金改定など、</span> <br />
							<br />
							<span>webサイトの鮮度を保つためには、</span> <br />
							<span>更新はかかせません。</span> <br />
							<br />
							<span>更新が滞ると、SEO的にもマイナスになります。</span> <br />
							<br />
							<span>当サービスは、基本的にお客様自身で更新できるよう、</span> <br />
							<span>CMS機能（web編集機能）を備えています。</span> <br />
							<br />
							<span>スタジオのお知らせや価格改定など、</span> <br />
							<span>ほとんどの更新作業はお客様自身で更新できるようにので、</span> <br />
							<span>ほぼ月額のままサイトの運営ができると思います。</span> <br />
							<br />
							<span>また、どうしてもご自身で更新が難しい場合は、</span> <br />
							<span>更新料1回3,000円〜として受け付けております。</span> <br />
						</Box>
					</div>
					<Box w="20em">
						<Box component={Image} src="/img/slide_5_Image.png" width={424} height={964} w="100%" h="auto" alt="更新のイメージ図" />
					</Box>
				</Flex>
			</div>
		</>
	);
};
