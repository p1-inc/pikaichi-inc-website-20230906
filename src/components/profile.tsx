import Image from "next/future/image";

import { Box, CSSObject, Divider, Flex, Text } from "@mantine/core";
import { PikaichistarSVG } from "../svg/pikaichistarSVG";

export const Profile = ({ ...props }) => {
	const leftContentStyle: CSSObject = {
		width: "10em",
		paddingRight: "1em",
		borderRight: "1px solid gray",
		textAlignLast: "justify",
	};

	return (
		<Box m="0 auto" fz="1em" pb="4em" sx={{ lineHeight: "2em" }} {...props}>
			<Flex direction="column" align="center" mt="1em" mb="2em">
				<PikaichistarSVG width="2em" />
				<Box>profile</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>名前</Box>

				<Box ml="1em">
					<p>清水&ensp;光</p>
					<br />
				</Box>
			</Flex>

			<Flex>
				<Box sx={leftContentStyle}>経歴</Box>

				<Box ml="1em">
					<p>武蔵野美術大学 視覚伝達デザイン科卒</p>
					<p>株式会社アサツー ディ・ケイを経て</p>
					<p> 株式会社ピカイチを設立</p>
					<br />
				</Box>
			</Flex>
			<Flex>
				<Box sx={leftContentStyle}>賞歴</Box>

				<Box ml="1em">
					<p>JR 交通広告グランプリ優秀賞</p>
					<p>消費者のためになった広告コンクール 金賞</p>
					<p>日本雑誌広告賞 銀賞</p>
					<p>産業広告賞 金賞、他</p>
					<br />
				</Box>
			</Flex>
			<Flex lh="1.4em">
				<Box sx={leftContentStyle}>概要</Box>
				<Box w="50em" ml="1em" fz="0.8em">
					ピカイチは、アートディレクター清水 光を代表とするデザイン会社。 代表の清水は、美術大学でデザインを学び、大手広告代理店アサツーディ・ケイにて
					12年間アートディレクターとして業務に携わってきた。のちに、独立し株式会社ピカイチを創立。
					株式会社ピカイチでの業務内容は、グラフィックデザイン、パッケージデザイン、ロゴ、CI、VI、
					CM企画まで、大手上場企業のブランディングや販売促進など、幅広くクリエイティブ活動を行ってきた。 2012年から現在まで活動中。
				</Box>
			</Flex>
		</Box>
	);
};
