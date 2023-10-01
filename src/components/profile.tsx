import { Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";
import { useRespStyles } from "../hooks/useRespStyles";
import { useEffect, useRef } from "react";

const contentProfile = {
	name: { key: "名前", content: ["清水 光"] },
	career: { key: "経歴", content: ["武蔵野美術大学 視覚伝達デザイン科卒", "株式会社アサツー ディ・ケイを経て", "株式会社ピカイチを設立"] },
	awards: { key: "賞歴", content: ["JR 交通広告グランプリ優秀賞", "消費者のためになった広告コンクール 金賞", "日本雑誌広告賞 銀賞", "産業広告賞 金賞、他"] },
	summary: {
		key: "概要",
		content: [
			"ピカイチは、アートディレクター清水 光を代表とするデザイン会社。 代表の清水は、美術大学でデザインを学び、大手広告代理店アサツーディ・ケイにて12年間アートディレクターとして業務に携わってきた。のちに、独立し株式会社ピカイチを創立。株式会社ピカイチでの業務内容は、グラフィックデザイン、パッケージデザイン、ロゴ、CI、VI、CM企画まで、大手上場企業のブランディングや販売促進など、幅広くクリエイティブ活動を行ってきた。 2012年から現在まで活動中。",
		],
	},
};

export const Profile = ({ ...props }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { mq, clp } = useRespStyles({ ref: containerRef, min: 599, max: 1024 });

	const leftContentStyle: CSSObject = {
		// width: mq.sp ? "8em" : "10em",
		width: "10em",
		paddingRight: "1em",
		borderRight: "1px solid gray",
		textAlignLast: "justify",
		flexShrink: 0,
	};

	return (
		<Box m="0 auto" fz={mq.sp ? "0.8em" : "1em"} pb="4em" sx={{ lineHeight: "2em" }} {...props} ref={containerRef}>
			<Flex direction="column" align="center" mt="1em" mb="2em" w="100%">
				<PikaichistarSVG width="2em" />
				<Box>profile</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentProfile.name.key}</Box>
				<Box ml="1em">
					{contentProfile.name.content.map((d, index) => (
						<p key={`key${index}`}>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentProfile.career.key}</Box>
				<Box ml="1em">
					{contentProfile.career.content.map((d, index) => (
						<p key={`key${index}`}>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>{contentProfile.awards.key}</Box>
				<Box ml="1em">
					{contentProfile.awards.content.map((d, index) => (
						<p key={`key${index}`}>{d}</p>
					))}
					<br />
				</Box>
			</Flex>

			<Flex lh="1.4em">
				<Box sx={leftContentStyle}>{contentProfile.summary.key}</Box>
				<Box w={mq.sp ? "25em" : "50em"} ml="1em" fz="0.8em">
					{contentProfile.summary.content.map((d, index) => (
						<p key={`key${index}`}>{d}</p>
					))}
					<br />
				</Box>
			</Flex>
		</Box>
	);
};
